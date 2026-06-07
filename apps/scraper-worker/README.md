# Fini scraper worker

Headless Node service that runs [`israeli-bank-scrapers`](https://github.com/eshaham/israeli-bank-scrapers)
(Puppeteer + Chromium) on behalf of Fini's Open Banking sync.

**Why a separate service?** The scraper drives a real Chromium browser. Convex
actions run in a serverless V8/Node sandbox that can't launch Chromium, so the
scraping lives here. Convex calls this worker over authenticated HTTPS, then
stores the returned transactions itself.

This package is intentionally **not** part of the pnpm workspace — installing it
pulls a ~300 MB Chromium download you don't want in the web app's `node_modules`.
Install and run it on its own.

## Run locally

```bash
cd apps/scraper-worker
cp .env.example .env          # set WORKER_SHARED_SECRET
npm install                   # downloads Chromium (first run is slow)
npm start                     # listens on :8787
```

Health check:

```bash
curl localhost:8787/health
# {"ok":true}
```

Smoke-test a scrape (use real credentials; SHOW_BROWSER=1 to watch it):

```bash
curl -s localhost:8787/scrape \
  -H "Authorization: Bearer $WORKER_SHARED_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"provider":"leumi","credentials":{"username":"...","password":"..."},"startDate":1704067200000}' | jq
```

## API

`POST /scrape` — body `{ provider, credentials, startDate }`

- `provider` — israeli-bank-scrapers `CompanyTypes` id (e.g. `leumi`, `visaCal`, `max`).
- `credentials` — object keyed by the provider's login fields.
- `startDate` — epoch **milliseconds**; earliest transaction to fetch.

Requires `Authorization: Bearer <WORKER_SHARED_SECRET>`. Returns
`{ success, accounts: [{ accountNumber, balance, txns: [...] }] }` or
`{ success: false, errorType, errorMessage }`.

## Connecting Convex to this worker

Set these in the Convex deployment (`npx convex env set ...`):

| var | value |
|-----|-------|
| `WORKER_URL` | public URL of this service (e.g. `https://fini-scraper.fly.dev`) |
| `WORKER_SHARED_SECRET` | same token as this worker's `.env` |
| `BANK_CREDS_KEY` | base64 32-byte AES key (`openssl rand -base64 32`) |

For local development, expose the worker with a tunnel and point `WORKER_URL`
at it:

```bash
npx ngrok http 8787   # then: npx convex env set WORKER_URL https://<id>.ngrok.app
```

## Deploy

`docker build -t fini-scraper . && docker run -p 8787:8787 --env-file .env fini-scraper`,
or push to Fly.io / Railway / Render. The included `Dockerfile` is based on the
official Puppeteer image so Chromium's system dependencies are present.

## Security

- Credentials are **never** logged or persisted; they exist only in memory for
  the duration of a scrape.
- The bearer token is the only thing standing between this service and the
  internet — keep it secret and serve over HTTPS.
- `oneZero` requires interactive OTP (2FA) and is not supported by this headless
  worker yet.
