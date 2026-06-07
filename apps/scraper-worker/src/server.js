// Fini scraper worker — runs israeli-bank-scrapers (Puppeteer/Chromium) behind a
// tiny authenticated HTTP API. Convex actions call POST /scrape; this service is
// stateless and never persists credentials.
import express from 'express'
import { createScraper, CompanyTypes } from 'israeli-bank-scrapers'

const PORT = Number(process.env.PORT) || 8787
const SHARED_SECRET = process.env.WORKER_SHARED_SECRET

if (!SHARED_SECRET) {
  console.error('FATAL: WORKER_SHARED_SECRET is not set. Refusing to start.')
  process.exit(1)
}

const VALID_PROVIDERS = new Set(Object.values(CompanyTypes))

const app = express()
app.use(express.json({ limit: '256kb' }))

// Bearer-token auth on everything except /health.
app.use((req, res, next) => {
  if (req.path === '/health') return next()
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (token !== SHARED_SECRET) {
    return res.status(401).json({ success: false, errorType: 'UNAUTHORIZED', errorMessage: 'Unauthorized' })
  }
  next()
})

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

// Normalize a scraper transaction to the shape Convex expects.
function normalizeTxn(t) {
  return {
    type: t.type,
    identifier: t.identifier,
    date: t.date,
    processedDate: t.processedDate,
    originalAmount: t.originalAmount,
    originalCurrency: t.originalCurrency,
    chargedAmount: t.chargedAmount,
    chargedCurrency: t.chargedCurrency,
    description: t.description,
    memo: t.memo,
    status: t.status,
    installments: t.installments,
  }
}

app.post('/scrape', async (req, res) => {
  const { provider, credentials, startDate } = req.body || {}

  if (!provider || !VALID_PROVIDERS.has(provider)) {
    return res.status(400).json({ success: false, errorType: 'BAD_REQUEST', errorMessage: `Unknown provider: ${provider}` })
  }
  if (!credentials || typeof credentials !== 'object') {
    return res.status(400).json({ success: false, errorType: 'BAD_REQUEST', errorMessage: 'Missing credentials' })
  }

  const start = startDate ? new Date(startDate) : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)

  try {
    const scraper = createScraper({
      companyId: provider,
      startDate: start,
      combineInstallments: false,
      showBrowser: process.env.SHOW_BROWSER === '1',
      timeout: 90000,
    })
    const result = await scraper.scrape(credentials)

    if (!result.success) {
      // Never echo credentials; only the issuer-provided error.
      return res.json({ success: false, errorType: result.errorType, errorMessage: result.errorMessage })
    }

    const accounts = (result.accounts || []).map((a) => ({
      accountNumber: a.accountNumber,
      balance: a.balance,
      txns: (a.txns || []).map(normalizeTxn),
    }))
    const txnCount = accounts.reduce((n, a) => n + a.txns.length, 0)
    console.log(`[scrape] ${provider}: ${accounts.length} account(s), ${txnCount} txn(s)`)
    return res.json({ success: true, accounts })
  } catch (err) {
    // Avoid logging the request body (it contains credentials).
    console.error(`[scrape] ${provider} failed:`, err && err.message ? err.message : err)
    return res.status(200).json({ success: false, errorType: 'GENERIC', errorMessage: 'Scrape failed' })
  }
})

app.listen(PORT, () => {
  console.log(`scraper-worker listening on :${PORT}`)
})
