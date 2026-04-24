'use client'
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '../ui/icon'
import { CatIcon } from '../ui/cat-icon'
import { CATS } from '../../lib/cats'
import type { Transaction } from '../../lib/seed'

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
        </div>

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
