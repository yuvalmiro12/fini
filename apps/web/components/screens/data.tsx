'use client'
import React, { useState } from 'react'
import { Icon } from '../ui/icon'
import { CatIcon } from '../ui/cat-icon'
import { TabBar } from '../ui/tab-bar'
import { StatusBar } from '../ui/status-bar'
import { CATS } from '../../lib/cats'
import type { Transaction, SavingsGoal } from '../../lib/seed'

interface ScreenProps {
  nav: (screen: string) => void
  transactions: Transaction[]
  savingsGoal?: SavingsGoal
  onSelectTx?: (id: string) => void
}

function LineChart({ transactions }: { transactions: Transaction[] }) {
  // Build 7-day spending curve
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
  const points = days.map(d => {
    const sum = transactions.filter(t => t.date === d && t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return sum || 0
  })
  const maxP = Math.max(...points, 1)
  const w = 300; const h = 80
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w
    const y = h - (p / maxP) * h * 0.85 - 8
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
  const areaPath = path + ` L ${w} ${h} L 0 ${h} Z`

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#chartGrad2)" />
      <path d={path} stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function DataMain({ nav, transactions, savingsGoal }: ScreenProps) {
  const expenses = transactions.filter(t => t.type === 'expense')
  const incomes  = transactions.filter(t => t.type === 'income')
  const totalExp = expenses.reduce((s, t) => s + t.amount, 0)
  const totalInc = incomes.reduce((s, t) => s + t.amount, 0)
  const total = totalExp + totalInc

  // Category breakdown — computed from transactions
  const catTotals: Record<string, number> = {}
  expenses.forEach(t => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount })
  const catBreakdown = Object.entries(catTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([cat, amount]) => ({ cat, amount, pct: totalExp > 0 ? Math.round((amount / totalExp) * 100) : 0 }))

  const incPct = total > 0 ? Math.round((totalInc / total) * 100) : 50
  const expPct = 100 - incPct

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#E8ECFF', direction: 'rtl', overflow: 'hidden' }}>
      <StatusBar />
      <div style={{ padding: '4px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 24, fontWeight: 700, color: '#1F1A15' }}>נתונים</div>
        <button
          onClick={() => nav('transactions')}
          style={{ background: 'rgba(255,255,255,0.6)', border: 'none', borderRadius: 12, padding: '8px 12px', cursor: 'pointer', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#5A6FB8', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Icon name="filter" size={16} color="#5A6FB8" />
          כל העסקאות
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 100px' }}>
        {/* Hero balance card */}
        <div style={{ background: 'linear-gradient(135deg, #5A6FB8 0%, #3D539A 100%)', borderRadius: 20, padding: 20, marginBottom: 14, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
            הוצאות {new Date().toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}
          </div>
          <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 36, fontWeight: 700, color: '#FFFFFF', marginBottom: 16 }}>
            ₪{totalExp.toLocaleString()}
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', borderRadius: 99, overflow: 'hidden', height: 10 }}>
              <div style={{ width: `${incPct}%`, background: '#5B8E6F', transition: 'width 0.6s ease' }} />
              <div style={{ width: `${expPct}%`, background: '#D47070', transition: 'width 0.6s ease' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#5B8E6F' }} />
              <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>הכנסות {incPct}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D47070' }} />
              <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>הוצאות {expPct}%</span>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <LineChart transactions={transactions} />
          </div>
        </div>

        {/* 2-up cards */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <div onClick={() => nav('savingsGoal')} style={{ flex: 1, background: 'rgba(255,255,255,0.8)', borderRadius: 16, padding: 14, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Icon name="piggy" size={16} color="#5B8E6F" />
              <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 11, color: '#8A8070' }}>חיסכון YTD</span>
            </div>
            <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 22, fontWeight: 700, color: '#5B8E6F' }}>₪{(savingsGoal?.current || 8400).toLocaleString()}</div>
            <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 11, color: '#4A4237', marginTop: 2 }}>מתוך יעד ₪{(savingsGoal?.target || 15000).toLocaleString()}</div>
          </div>
          <div onClick={() => nav('couples')} style={{ flex: 1, background: 'rgba(255,255,255,0.8)', borderRadius: 16, padding: 14, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Icon name="users" size={16} color="#C85A8A" />
              <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 11, color: '#8A8070' }}>תקציב משותף</span>
            </div>
            <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 22, fontWeight: 700, color: '#C85A8A' }}>₪5,340</div>
            <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 11, color: '#4A4237', marginTop: 2 }}>מתוך ₪8,000 החודש</div>
          </div>
        </div>

        {/* Category breakdown */}
        <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 18, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 15, fontWeight: 700, color: '#1F1A15' }}>לפי קטגוריה</span>
            <button onClick={() => nav('transactions')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#5A6FB8', fontWeight: 500 }}>הכל</button>
          </div>
          {catBreakdown.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, color: '#8A8070' }}>אין עסקאות עדיין</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {catBreakdown.map(item => {
                const catDef = CATS[item.cat]
                if (!catDef) return null
                return (
                  <div key={item.cat} onClick={() => nav('transactions')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <CatIcon cat={item.cat} size={36} radius={10} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, fontWeight: 500, color: '#1F1A15' }}>{catDef.label}</span>
                        <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, fontWeight: 600, color: '#4A4237' }}>₪{item.amount.toLocaleString()}</span>
                      </div>
                      <div style={{ background: 'rgba(31,26,21,0.08)', borderRadius: 99, height: 5, position: 'relative' }}>
                        <div style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: `${item.pct}%`, background: catDef.ink, borderRadius: 99 }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <TabBar active="data" onTab={t => nav(t)} />
    </div>
  )
}

const FILTER_CHIPS = ['הכל', 'הוצאות', 'הכנסות', 'מסומנים']

interface TxListProps {
  nav: (screen: string) => void
  transactions: Transaction[]
  onSelectTx: (id: string) => void
}

export function TransactionsList({ nav, transactions, onSelectTx }: TxListProps) {
  const [activeFilter, setActiveFilter] = useState('הכל')
  const [searchText, setSearchText] = useState('')

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  const filtered = transactions.filter(tx => {
    if (activeFilter === 'הוצאות' && tx.type !== 'expense') return false
    if (activeFilter === 'הכנסות' && tx.type !== 'income') return false
    if (activeFilter === 'מסומנים' && !tx.flagged) return false
    if (searchText && !tx.title.includes(searchText)) return false
    return true
  })

  const groups: Record<string, Transaction[]> = {}
  filtered.forEach(tx => {
    const label = tx.date === today ? 'היום' : tx.date === yesterday ? 'אתמול' : tx.date
    if (!groups[label]) groups[label] = []
    groups[label].push(tx)
  })

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#E8ECFF', direction: 'rtl', overflow: 'hidden' }}>
      <StatusBar />
      <div style={{ padding: '4px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => nav('data')} style={{ background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: 12, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#1F1A15' }}>
          <Icon name="arrowL" size={16} color="#1F1A15" />
          חזור
        </button>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.7)', borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="search" size={16} color="#8A8070" />
          <input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="חפש עסקה..." style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#1F1A15', outline: 'none', direction: 'rtl' }} />
          {searchText && (
            <button onClick={() => setSearchText('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
              <Icon name="close" size={14} color="#8A8070" />
            </button>
          )}
        </div>
        <button onClick={() => nav('addTx')} style={{ background: '#C85A8A', border: 'none', borderRadius: 12, padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="plus" size={20} color="#FFFFFF" />
        </button>
      </div>

      <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8 }}>
        {FILTER_CHIPS.map(chip => (
          <button key={chip} onClick={() => setActiveFilter(chip)} style={{ padding: '6px 14px', borderRadius: 99, border: 'none', background: activeFilter === chip ? '#5A6FB8' : 'rgba(255,255,255,0.7)', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, fontWeight: 500, color: activeFilter === chip ? '#FFFFFF' : '#4A4237', cursor: 'pointer' }}>
            {chip}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 100px' }}>
        {Object.keys(groups).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 15, color: '#8A8070' }}>
            {searchText ? 'לא נמצאו תוצאות' : 'אין עסקאות עדיין'}
          </div>
        ) : (
          Object.entries(groups).map(([date, txs]) => (
            <div key={date} style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, fontWeight: 600, color: '#8A8070', marginBottom: 8 }}>{date}</div>
              <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 16, overflow: 'hidden' }}>
                {txs.map((tx, i) => (
                  <div key={tx.id} onClick={() => onSelectTx(tx.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i < txs.length - 1 ? '1px solid rgba(31,26,21,0.05)' : 'none', cursor: 'pointer' }}>
                    <CatIcon cat={tx.category} size={40} radius={11} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 500, color: '#1F1A15' }}>{tx.title}</span>
                        {tx.flagged && (
                          <div style={{ background: '#F3E7C7', borderRadius: 99, padding: '2px 7px', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 10, fontWeight: 600, color: '#C9A24D' }}>מסומן</div>
                        )}
                      </div>
                      <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, color: '#8A8070' }}>
                        {CATS[tx.category]?.label} · {tx.time}
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 15, fontWeight: 700, color: tx.type === 'income' ? '#5B8E6F' : '#D47070' }}>
                      {tx.type === 'income' ? '+' : '-'}₪{tx.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <TabBar active="data" onTab={t => nav(t)} />
    </div>
  )
}
