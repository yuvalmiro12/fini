'use client'
import React, { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as XLSX from 'xlsx'
import { useAction, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Icon } from '../ui/icon'
import { CatIcon } from '../ui/cat-icon'
import { CATS } from '../../lib/cats'
import type { Transaction } from '../../lib/seed'

type CsvSource = 'cal' | 'max' | 'isracard' | 'amex' | 'hapoalim' | 'leumi' | 'discount' | 'mizrahi' | 'fibi' | 'other'
type ImportResult = { file: string; importedCount: number; skippedCount: number; error?: string }

const SOURCE_OPTIONS: { value: CsvSource; label: string; kind: 'card' | 'bank' }[] = [
  { value: 'cal', label: 'Cal (כאל)', kind: 'card' },
  { value: 'max', label: 'Max (לאומי קארד)', kind: 'card' },
  { value: 'isracard', label: 'ישראכרט', kind: 'card' },
  { value: 'amex', label: 'American Express', kind: 'card' },
  { value: 'hapoalim', label: 'בנק הפועלים', kind: 'bank' },
  { value: 'leumi', label: 'בנק לאומי', kind: 'bank' },
  { value: 'discount', label: 'בנק דיסקונט', kind: 'bank' },
  { value: 'mizrahi', label: 'מזרחי טפחות', kind: 'bank' },
  { value: 'fibi', label: 'הבינלאומי / פאג"י', kind: 'bank' },
  { value: 'other', label: 'אחר / Generic CSV', kind: 'card' },
]

/**
 * TransactionsDesktop — real finance-app transactions table.
 * Layout: filter sidebar (220px, right in RTL) + main table (grid columns).
 * Replaces the mobile TransactionsList rendered inside a card.
 */

interface Props {
  nav: (screen: string) => void
  transactions: Transaction[]
  onSelectTx: (id: string) => void
}

const FILTER_OPTS = [
  { key: 'all', label: 'כל העסקאות' },
  { key: 'expense', label: 'הוצאות' },
  { key: 'income', label: 'הכנסות' },
  { key: 'flagged', label: 'מסומנים' },
]

export function TransactionsDesktop({ nav, transactions, onSelectTx }: Props) {
  const [filter, setFilter] = useState<'all' | 'expense' | 'income' | 'flagged'>('all')
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<string | null>(null)
  const [showUploadPanel, setShowUploadPanel] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [source, setSource] = useState<CsvSource>('cal')
  const [accountLabel, setAccountLabel] = useState('')
  const [importResults, setImportResults] = useState<ImportResult[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const importCsv = useAction(api.import.importCsv)
  const getOrCreateMockUser = useMutation(api.users.getOrCreateMockUser)

  const fileToCsvText = async (file: File): Promise<string> => {
    const name = file.name.toLowerCase()
    const isExcel = name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.xlsm')
    if (!isExcel) return await file.text()
    const buf = await file.arrayBuffer()
    const wb = XLSX.read(buf, { type: 'array', cellDates: false })
    for (const sheetName of wb.SheetNames) {
      const sheet = wb.Sheets[sheetName]
      const csv = XLSX.utils.sheet_to_csv(sheet, { blankrows: false, strip: true })
      if (csv.trim().length > 0) return csv
    }
    return ''
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    try {
      setIsUploading(true)
      setImportResults([])
      const userId = await getOrCreateMockUser()
      const results: ImportResult[] = []
      for (const file of files) {
        try {
          const text = await fileToCsvText(file)
          if (!text.trim()) { results.push({ file: file.name, importedCount: 0, skippedCount: 0, error: 'הקובץ ריק או לא נקרא' }); continue }
          const result = await importCsv({ fileContent: text, userId, source, accountLabel: accountLabel.trim() || undefined })
          results.push({ file: file.name, importedCount: result.importedCount, skippedCount: result.skippedCount })
        } catch (err) {
          results.push({ file: file.name, importedCount: 0, skippedCount: 0, error: String(err) })
        }
      }
      setImportResults(results)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (filter === 'expense' && tx.type !== 'expense') return false
      if (filter === 'income' && tx.type !== 'income') return false
      if (filter === 'flagged' && !tx.flagged) return false
      if (catFilter && tx.category !== catFilter) return false
      if (search && !tx.title.includes(search)) return false
      return true
    })
  }, [transactions, filter, search, catFilter])

  const total = filtered.reduce((s, t) => s + (t.type === 'expense' ? t.amount : -t.amount), 0)

  // Category summary for sidebar
  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    transactions.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [transactions])

  return (
    <div
      style={{
        padding: '24px 28px 80px',
        maxWidth: 1280,
        margin: '0 auto',
        direction: 'rtl',
        fontFamily: "'Rubik', system-ui, sans-serif",
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gap: 20,
        alignItems: 'start',
      }}
    >
      {/* Filter sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(31,26,21,0.06)',
          borderRadius: 14,
          padding: 16,
          position: 'sticky',
          top: 80,
        }}
      >
        <div style={{ fontSize: 12, color: '#8A8070', fontWeight: 600, marginBottom: 10, letterSpacing: 0.3 }}>סינון</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 18 }}>
          {FILTER_OPTS.map((opt, i) => {
            const active = filter === opt.key
            return (
              <motion.button
                key={opt.key}
                onClick={() => setFilter(opt.key as typeof filter)}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.04, duration: 0.22 }}
                whileHover={{ background: 'rgba(90,111,184,0.05)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  textAlign: 'right',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  background: active ? 'rgba(90,111,184,0.08)' : 'transparent',
                  color: active ? '#5A6FB8' : '#4A4237',
                  fontFamily: "'Rubik', system-ui, sans-serif",
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  direction: 'rtl',
                }}
              >
                {opt.label}
              </motion.button>
            )
          })}
        </div>

        <div style={{ fontSize: 12, color: '#8A8070', fontWeight: 600, marginBottom: 10, letterSpacing: 0.3 }}>קטגוריות</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <motion.button
            onClick={() => setCatFilter(null)}
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.28, duration: 0.22 }}
            whileHover={{ background: 'rgba(90,111,184,0.05)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              textAlign: 'right',
              padding: '8px 12px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              background: catFilter === null ? 'rgba(90,111,184,0.08)' : 'transparent',
              color: catFilter === null ? '#5A6FB8' : '#4A4237',
              fontFamily: "'Rubik', system-ui, sans-serif",
              fontSize: 13,
              fontWeight: catFilter === null ? 600 : 500,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>הכל</span>
            <span style={{ fontSize: 11, color: '#8A8070' }}>{transactions.length}</span>
          </motion.button>
          {catCounts.map(([cat, n], i) => {
            const catDef = CATS[cat]
            if (!catDef) return null
            const active = catFilter === cat
            return (
              <motion.button
                key={cat}
                onClick={() => setCatFilter(cat)}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.32 + i * 0.03, duration: 0.22 }}
                whileHover={{ background: 'rgba(90,111,184,0.05)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  background: active ? 'rgba(90,111,184,0.08)' : 'transparent',
                  color: active ? '#5A6FB8' : '#4A4237',
                  fontFamily: "'Rubik', system-ui, sans-serif",
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  direction: 'rtl',
                }}
              >
                <CatIcon cat={cat} size={20} radius={6} />
                <span style={{ flex: 1, textAlign: 'right' }}>{catDef.label}</span>
                <span style={{ fontSize: 11, color: '#8A8070' }}>{n}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.aside>

      {/* Main table */}
      <div>
        {/* Summary + search row */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(31,26,21,0.06)',
              borderRadius: 10,
              padding: '10px 14px',
            }}
          >
            <div style={{ fontSize: 11, color: '#8A8070', marginBottom: 2 }}>תוצאות</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1F1A15' }}>
              {filtered.length} <span style={{ fontSize: 12, fontWeight: 500, color: '#8A8070' }}>עסקאות</span>
            </div>
          </div>
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(31,26,21,0.06)',
              borderRadius: 10,
              padding: '10px 14px',
            }}
          >
            <div style={{ fontSize: 11, color: '#8A8070', marginBottom: 2 }}>סה״כ</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: total >= 0 ? '#D47070' : '#5B8E6F' }}>
              {total >= 0 ? '-' : '+'}₪{Math.abs(total).toLocaleString()}
            </div>
          </div>

          <div
            style={{
              marginRight: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              background: '#FFFFFF',
              border: '1px solid rgba(31,26,21,0.06)',
              borderRadius: 10,
              width: 280,
            }}
          >
            <Icon name="search" size={16} color="#8A8070" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חפש עסקה..."
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontFamily: "'Rubik', system-ui, sans-serif",
                fontSize: 13,
                color: '#1F1A15',
                direction: 'rtl',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
              >
                <Icon name="close" size={14} color="#8A8070" />
              </button>
            )}
          </div>

          <input type="file" accept=".csv,.xlsx,.xls,.xlsm" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
          <button
            onClick={() => { setShowUploadPanel(v => !v); setImportResults([]) }}
            disabled={isUploading}
            style={{ background: isUploading ? '#A0AABF' : showUploadPanel ? '#3D539A' : '#5A6FB8', border: 'none', borderRadius: 10, padding: '9px 14px', cursor: isUploading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 7, color: '#FFFFFF', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, fontWeight: 600 }}
          >
            <Icon name="upload" size={16} color="#FFFFFF" />
            ייבוא CSV / XLSX
          </button>
        </div>

        {showUploadPanel && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            style={{ marginBottom: 16, padding: 16, background: '#FFFFFF', borderRadius: 14, border: '1px solid rgba(31,26,21,0.06)', display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 700, color: '#1F1A15' }}>ייבוא קבצי CSV / Excel</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 11, color: '#8A8070' }}>מקור</label>
                <select value={source} onChange={e => setSource(e.target.value as CsvSource)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(31,26,21,0.12)', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#1F1A15', background: '#FFFFFF', direction: 'rtl' }}>
                  <optgroup label="כרטיסי אשראי">{SOURCE_OPTIONS.filter(o => o.kind === 'card').map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</optgroup>
                  <optgroup label="חשבונות בנק">{SOURCE_OPTIONS.filter(o => o.kind === 'bank').map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</optgroup>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 11, color: '#8A8070' }}>תיוג חשבון (אופציונלי)</label>
                <input value={accountLabel} onChange={e => setAccountLabel(e.target.value)} placeholder='לדוגמה: כרטיס אישי' style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(31,26,21,0.12)', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#1F1A15', background: '#FFFFFF', outline: 'none', direction: 'rtl', width: 200 }} />
              </div>
              <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} style={{ padding: '9px 16px', borderRadius: 8, border: 'none', background: isUploading ? '#A0AABF' : '#5A6FB8', color: '#FFFFFF', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, fontWeight: 600, cursor: isUploading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
                <Icon name="upload" size={15} color="#FFFFFF" />
                {isUploading ? 'מייבא...' : 'בחר קבצים'}
              </button>
            </div>
            <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 11, color: '#8A8070' }}>תומך ב-CSV ו-Excel (XLSX). מזהה אוטומטית כותרות עבריות, תאריכים DD/MM/YYYY, ועמודות חובה/זכות.</div>
            {importResults.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {importResults.map((r, i) => (
                  <div key={i} style={{ padding: '8px 12px', background: r.error ? '#FBE6E6' : '#E6F3EC', borderRadius: 8, fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, color: r.error ? '#A14040' : '#3A6B4F' }}>
                    <span style={{ fontWeight: 600 }}>{r.file}</span>{' — '}
                    {r.error ? `שגיאה: ${r.error}` : `יובאו ${r.importedCount} עסקאות${r.skippedCount > 0 ? ` · דולגו ${r.skippedCount}` : ''}`}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Table */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(31,26,21,0.06)',
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '44px 1fr 180px 140px 120px 40px',
              gap: 12,
              padding: '12px 20px',
              background: '#F7F5E8',
              borderBottom: '1px solid rgba(31,26,21,0.06)',
              fontSize: 11,
              fontWeight: 600,
              color: '#8A8070',
              letterSpacing: 0.3,
              textTransform: 'uppercase',
            }}
          >
            <span></span>
            <span>עסקה</span>
            <span>קטגוריה</span>
            <span>תאריך</span>
            <span style={{ textAlign: 'left' }}>סכום</span>
            <span></span>
          </div>

          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ padding: '60px 20px', textAlign: 'center' }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(31,26,21,0.04)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <Icon name="search" size={24} color="#8A8070" />
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1F1A15', marginBottom: 4 }}>לא נמצאו עסקאות</div>
              <div style={{ fontSize: 13, color: '#8A8070' }}>נסה לשנות את הסינון או לחפש משהו אחר</div>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout" initial={true}>
              {filtered.map((tx, i) => {
                const catDef = CATS[tx.category]
                return (
                  <motion.div
                    key={tx.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: Math.min(i * 0.025, 0.6), duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ background: '#FAFAF5', x: -2 }}
                    onClick={() => onSelectTx(tx.id)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '44px 1fr 180px 140px 120px 40px',
                      gap: 12,
                      padding: '14px 20px',
                      borderBottom: i < filtered.length - 1 ? '1px solid rgba(31,26,21,0.05)' : 'none',
                      cursor: 'pointer',
                      alignItems: 'center',
                    }}
                  >
                    <CatIcon cat={tx.category} size={36} radius={9} />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: '#1F1A15',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.title}</span>
                        {tx.flagged && (
                          <span
                            style={{
                              background: '#F3E7C7',
                              color: '#C9A24D',
                              fontSize: 10,
                              fontWeight: 600,
                              padding: '2px 6px',
                              borderRadius: 4,
                            }}
                          >
                            מסומן
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: '#8A8070', marginTop: 2 }}>{tx.time}</div>
                    </div>
                    <div style={{ fontSize: 13, color: '#4A4237' }}>{catDef?.label}</div>
                    <div style={{ fontSize: 13, color: '#8A8070' }}>{tx.date}</div>
                    <div
                      style={{
                        textAlign: 'left',
                        fontSize: 14,
                        fontWeight: 700,
                        color: tx.type === 'income' ? '#5B8E6F' : '#D47070',
                      }}
                    >
                      {tx.type === 'income' ? '+' : '-'}₪{tx.amount.toLocaleString()}
                    </div>
                    <Icon name="chevron-left" size={16} color="#C0B8AD" />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}
