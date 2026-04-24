'use client'
import React from 'react'
import { Icon } from '../ui/icon'
import { CatIcon } from '../ui/cat-icon'
import { CATS } from '../../lib/cats'
import type { Transaction, SavingsGoal } from '../../lib/seed'

/**
 * Dashboard (desktop) — real finance-app layout.
 * NOT a phone stretched. 1200px max content, CSS grid for cards.
 *
 * Layout:
 *   Row 1 — 3 metric cards (net, income, expenses)
 *   Row 2 — spending trend (wide, 2col) + savings goal (1col)
 *   Row 3 — categories (1col) + recent transactions (2col table)
 */

interface Props {
  nav: (screen: string) => void
  transactions: Transaction[]
  savingsGoal: SavingsGoal
}

function SparkChart({ transactions, height = 120 }: { transactions: Transaction[]; height?: number }) {
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    return d.toISOString().split('T')[0]
  })
  const points = days.map((d) =>
    transactions.filter((t) => t.date === d && t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  )
  const maxP = Math.max(...points, 1)
  const w = 600
  const h = height
  const path = points
    .map((p, i) => {
      const x = (i / Math.max(points.length - 1, 1)) * w
      const y = h - (p / maxP) * h * 0.8 - 10
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
  const areaPath = path + ` L ${w} ${h} L 0 ${h} Z`

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="dashSpark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5A6FB8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#5A6FB8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#dashSpark)" />
      <path d={path} stroke="#5A6FB8" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MetricCard({
  label,
  value,
  delta,
  tone,
  icon,
}: {
  label: string
  value: string
  delta: string
  tone: 'neutral' | 'up' | 'down'
  icon: string
}) {
  const deltaColor = tone === 'up' ? '#5B8E6F' : tone === 'down' ? '#D47070' : '#8A8070'
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(31,26,21,0.06)',
        borderRadius: 14,
        padding: 20,
        direction: 'rtl',
        fontFamily: "'Rubik', system-ui, sans-serif",
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: '#8A8070', fontWeight: 500 }}>{label}</span>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'rgba(90,111,184,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name={icon} size={16} color="#5A6FB8" />
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#1F1A15', letterSpacing: -0.5, marginBottom: 6 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: deltaColor, fontWeight: 500 }}>{delta}</div>
    </div>
  )
}

export function DashboardDesktop({ nav, transactions, savingsGoal }: Props) {
  const expenses = transactions.filter((t) => t.type === 'expense')
  const incomes = transactions.filter((t) => t.type === 'income')
  const totalExp = expenses.reduce((s, t) => s + t.amount, 0)
  const totalInc = incomes.reduce((s, t) => s + t.amount, 0)
  const net = totalInc - totalExp

  const catTotals: Record<string, number> = {}
  expenses.forEach((t) => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount
  })
  const catBreakdown = Object.entries(catTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([cat, amount]) => ({
      cat,
      amount,
      pct: totalExp > 0 ? Math.round((amount / totalExp) * 100) : 0,
    }))

  const recent = [...transactions]
    .sort((a, b) => (b.date > a.date ? 1 : -1))
    .slice(0, 8)

  const goalPct = Math.min(100, Math.round((savingsGoal.current / savingsGoal.target) * 100))

  return (
    <div
      style={{
        padding: '24px 28px 80px',
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%',
        direction: 'rtl',
        fontFamily: "'Rubik', system-ui, sans-serif",
      }}
    >
      {/* Row 1 — 3 metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 18 }}>
        <MetricCard
          label="יתרה נטו"
          value={`₪${net.toLocaleString()}`}
          delta={net >= 0 ? '▲ ' + Math.round((net / Math.max(totalInc, 1)) * 100) + '% חיסכון' : '▼ גירעון'}
          tone={net >= 0 ? 'up' : 'down'}
          icon="wallet"
        />
        <MetricCard
          label="הכנסות החודש"
          value={`₪${totalInc.toLocaleString()}`}
          delta={`${incomes.length} תקבולים`}
          tone="up"
          icon="trend"
        />
        <MetricCard
          label="הוצאות החודש"
          value={`₪${totalExp.toLocaleString()}`}
          delta={`${expenses.length} עסקאות`}
          tone="down"
          icon="receipt"
        />
      </div>

      {/* Row 2 — spend trend + savings goal */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 18 }}>
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(31,26,21,0.06)',
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: 11, color: '#8A8070', fontWeight: 500, marginBottom: 3 }}>מגמת הוצאות — 30 ימים</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1F1A15', letterSpacing: -0.5 }}>
                ₪{totalExp.toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => nav('insights')}
              style={{
                background: 'transparent',
                border: '1px solid rgba(31,26,21,0.1)',
                borderRadius: 8,
                padding: '6px 12px',
                cursor: 'pointer',
                fontFamily: "'Rubik', system-ui, sans-serif",
                fontSize: 12,
                color: '#4A4237',
                fontWeight: 500,
              }}
            >
              תובנות
            </button>
          </div>
          <div style={{ marginTop: 14 }}>
            <SparkChart transactions={transactions} height={140} />
          </div>
        </div>

        <div
          onClick={() => nav('savingsGoal')}
          style={{
            background: 'linear-gradient(135deg, #5B8E6F 0%, #3F6850 100%)',
            borderRadius: 14,
            padding: 20,
            color: '#FFFFFF',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -40,
              left: -40,
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
            }}
          />
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 6 }}>יעד חיסכון</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>{savingsGoal.title}</div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5, marginBottom: 2 }}>
            ₪{savingsGoal.current.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 14 }}>
            מתוך ₪{savingsGoal.target.toLocaleString()}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${goalPct}%`,
                background: '#FFFFFF',
                borderRadius: 99,
                transition: 'width 0.6s ease',
              }}
            />
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 8 }}>{goalPct}% הושלמו</div>
        </div>
      </div>

      {/* Row 3 — categories + recent tx */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
        {/* Categories */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(31,26,21,0.06)',
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1F1A15' }}>לפי קטגוריה</div>
            <button
              onClick={() => nav('insights')}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                color: '#5A6FB8',
                fontWeight: 500,
                fontFamily: "'Rubik', system-ui, sans-serif",
              }}
            >
              הצג הכל
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {catBreakdown.length === 0 ? (
              <div style={{ padding: '20px 0', textAlign: 'center', fontSize: 13, color: '#8A8070' }}>
                אין עסקאות עדיין
              </div>
            ) : (
              catBreakdown.map((item) => {
                const catDef = CATS[item.cat]
                if (!catDef) return null
                return (
                  <div key={item.cat} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CatIcon cat={item.cat} size={32} radius={9} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#1F1A15' }}>{catDef.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#4A4237' }}>
                          ₪{item.amount.toLocaleString()}
                        </span>
                      </div>
                      <div style={{ background: 'rgba(31,26,21,0.06)', borderRadius: 99, height: 5, position: 'relative' }}>
                        <div
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            height: '100%',
                            width: `${item.pct}%`,
                            background: catDef.ink,
                            borderRadius: 99,
                            transition: 'width 0.6s ease',
                          }}
                        />
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: '#8A8070', minWidth: 28, textAlign: 'left' }}>{item.pct}%</span>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Recent transactions table */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(31,26,21,0.06)',
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1F1A15' }}>עסקאות אחרונות</div>
            <button
              onClick={() => nav('transactions')}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                color: '#5A6FB8',
                fontWeight: 500,
                fontFamily: "'Rubik', system-ui, sans-serif",
              }}
            >
              כל העסקאות
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recent.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 13, color: '#8A8070' }}>
                עוד לא נוספו עסקאות
              </div>
            ) : (
              recent.map((tx, i) => {
                const catDef = CATS[tx.category]
                return (
                  <div
                    key={tx.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '36px 1fr 120px 120px',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 4px',
                      borderBottom: i < recent.length - 1 ? '1px solid rgba(31,26,21,0.05)' : 'none',
                    }}
                  >
                    <CatIcon cat={tx.category} size={32} radius={8} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#1F1A15', marginBottom: 2 }}>{tx.title}</div>
                      <div style={{ fontSize: 11, color: '#8A8070' }}>{catDef?.label}</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#8A8070', textAlign: 'right' }}>
                      {tx.date}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: tx.type === 'income' ? '#5B8E6F' : '#D47070',
                        textAlign: 'left',
                      }}
                    >
                      {tx.type === 'income' ? '+' : '-'}₪{tx.amount.toLocaleString()}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
