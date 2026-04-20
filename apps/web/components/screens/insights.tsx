'use client'
import React, { useState } from 'react'
import { Icon } from '../ui/icon'
import { FiniAvatar } from '../ui/fini-mascot'
import { TabBar } from '../ui/tab-bar'
import { StatusBar } from '../ui/status-bar'
import type { SavingsGoal as SavingsGoalType } from '../../lib/seed'

interface InsightsProps {
  nav: (screen: string) => void
  savingsGoal: SavingsGoalType
}

interface GoalProps {
  nav: (screen: string) => void
  savingsGoal: SavingsGoalType
  onUpdate: (goal: SavingsGoalType) => void
}

const INSIGHT_ROWS = [
  { id: 'i1', icon: 'trend',  title: 'הוצאות אוכל',  subtitle: 'ירדו ב-8% מהחודש שעבר',    tint: '#D6EEE0', ink: '#5B8E6F', value: '-8%',  positive: true  },
  { id: 'i2', icon: 'cart',   title: 'קניות',          subtitle: 'עלו ב-15% — מעל התקציב',   tint: '#FADEDC', ink: '#D47070', value: '+15%', positive: false },
  { id: 'i3', icon: 'bolt',   title: 'חשבונות',        subtitle: 'גבוה ב-23% מהממוצע',       tint: '#F3E7C7', ink: '#C9A24D', value: '+23%', positive: false },
  { id: 'i4', icon: 'piggy',  title: 'חיסכון',         subtitle: 'על המסלול לעמוד ביעד!',    tint: '#D4DBFA', ink: '#5A6FB8', value: '56%',  positive: true  },
]

export function InsightsMain({ nav, savingsGoal }: InsightsProps) {
  const pct = Math.round((savingsGoal.current / savingsGoal.target) * 100)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#D6EEE0', direction: 'rtl', overflow: 'hidden' }}>
      <StatusBar />
      <div style={{ padding: '4px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 24, fontWeight: 700, color: '#1F1A15' }}>תובנות</div>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => nav('notifications')}
            style={{ background: 'rgba(255,255,255,0.6)', border: 'none', borderRadius: 12, padding: '8px', cursor: 'pointer', display: 'flex' }}
          >
            <Icon name="bell" size={22} color="#1F1A15" />
          </button>
          <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#C85A8A', border: '2px solid #D6EEE0' }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 100px' }}>
        {/* Savings hero */}
        <div
          onClick={() => nav('savingsGoal')}
          style={{ background: 'linear-gradient(135deg, #5B8E6F 0%, #3D6B53 100%)', borderRadius: 20, padding: 20, cursor: 'pointer', marginBottom: 16, position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Icon name="target" size={18} color="rgba(255,255,255,0.8)" />
            <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>מטרת חיסכון</span>
          </div>
          <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 22, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>{savingsGoal.title}</div>
          <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 14 }}>
            ₪{savingsGoal.current.toLocaleString()} מתוך ₪{savingsGoal.target.toLocaleString()}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 99, height: 8, position: 'relative' }}>
            <div style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: `${pct}%`, background: '#BEE3CB', borderRadius: 99, transition: 'width 0.6s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{pct}% הושלם</span>
            <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>עוד ₪{(savingsGoal.target - savingsGoal.current).toLocaleString()}</span>
          </div>
        </div>

        {/* Insight rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {INSIGHT_ROWS.map(row => (
            <div key={row.id} style={{ background: 'rgba(255,255,255,0.75)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: row.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={row.icon} size={22} color={row.ink} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 600, color: '#1F1A15' }}>{row.title}</div>
                <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, color: '#4A4237' }}>{row.subtitle}</div>
              </div>
              <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 700, color: row.positive ? '#5B8E6F' : '#D47070', padding: '4px 10px', borderRadius: 99, background: row.positive ? '#DDEEDF' : '#FADEDC' }}>
                {row.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="insights" onTab={t => nav(t)} />
    </div>
  )
}

export function SavingsGoal({ nav, savingsGoal, onUpdate }: GoalProps) {
  const [goal, setGoal] = useState(savingsGoal)
  const [editMode, setEditMode] = useState(false)
  const [editTarget, setEditTarget] = useState(String(goal.target))
  const [editTitle, setEditTitle] = useState(goal.title)
  const [depositAmount, setDepositAmount] = useState('')
  const [showDeposit, setShowDeposit] = useState(false)

  const pct = Math.round((goal.current / goal.target) * 100)
  const circumference = 2 * Math.PI * 80
  const dashOffset = circumference * (1 - pct / 100)

  const TIMELINE = [
    { label: 'פברואר', amount: 1500 },
    { label: 'מרץ',   amount: 2200 },
    { label: 'אפריל', amount: 1800 },
    { label: 'מאי',   amount: 2900 },
  ]

  const handleSaveEdit = () => {
    const updated = { ...goal, title: editTitle, target: Number(editTarget) || goal.target }
    setGoal(updated)
    onUpdate(updated)
    setEditMode(false)
  }

  const handleDeposit = () => {
    const amount = Number(depositAmount)
    if (amount > 0) {
      const updated = { ...goal, current: goal.current + amount }
      setGoal(updated)
      onUpdate(updated)
      setDepositAmount('')
      setShowDeposit(false)
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#D6EEE0', direction: 'rtl', overflow: 'hidden' }}>
      <StatusBar />
      <div style={{ padding: '4px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => nav('insights')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: 99, padding: '8px 14px', cursor: 'pointer', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 500, color: '#1F1A15' }}>
          <Icon name="arrow" size={16} color="#1F1A15" />
          חזור
        </button>
        <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 18, fontWeight: 700, color: '#1F1A15' }}>
          {editMode ? 'עריכת יעד' : goal.title}
        </span>
        <button
          onClick={() => { setEditMode(!editMode); setEditTitle(goal.title); setEditTarget(String(goal.target)) }}
          style={{ background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: 10, padding: '8px', cursor: 'pointer' }}
        >
          <Icon name={editMode ? 'close' : 'dots'} size={20} color="#4A4237" />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 100px' }}>
        {editMode ? (
          /* Edit mode */
          <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 18, padding: 20, marginBottom: 14 }}>
            <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 600, color: '#4A4237', marginBottom: 6 }}>שם היעד</div>
            <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid rgba(31,26,21,0.15)', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 15, color: '#1F1A15', outline: 'none', direction: 'rtl', background: '#FAFAF5', marginBottom: 16, boxSizing: 'border-box' }} />
            <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 600, color: '#4A4237', marginBottom: 6 }}>סכום יעד (₪)</div>
            <input type="number" value={editTarget} onChange={e => setEditTarget(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid rgba(31,26,21,0.15)', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 15, color: '#1F1A15', outline: 'none', background: '#FAFAF5', marginBottom: 20, boxSizing: 'border-box' }} />
            <button onClick={handleSaveEdit} style={{ width: '100%', padding: '14px', borderRadius: 14, background: '#5B8E6F', border: 'none', cursor: 'pointer', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>
              שמור שינויים
            </button>
          </div>
        ) : (
          <>
            {/* Progress ring */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <div style={{ position: 'relative', width: 200, height: 200 }}>
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(91,142,111,0.2)" strokeWidth="12" />
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#5B8E6F" strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={dashOffset}
                    transform="rotate(-90 100 100)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 40, fontWeight: 700, color: '#1F1A15' }}>{pct}%</span>
                  <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, color: '#4A4237' }}>הושלם</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'נצבר', value: `₪${goal.current.toLocaleString()}`, color: '#5B8E6F' },
                { label: 'יעד',  value: `₪${goal.target.toLocaleString()}`,  color: '#1F1A15' },
                { label: 'נותר', value: `₪${(goal.target - goal.current).toLocaleString()}`, color: '#C85A8A' },
              ].map((stat, i) => (
                <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.75)', borderRadius: 14, padding: '12px 10px', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 16, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 11, color: '#8A8070', marginTop: 2 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Deposit */}
            <div style={{ background: 'rgba(255,255,255,0.75)', borderRadius: 18, padding: 16, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showDeposit ? 12 : 0 }}>
                <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 700, color: '#1F1A15' }}>הוסף לחיסכון</span>
                <button onClick={() => setShowDeposit(v => !v)} style={{ background: showDeposit ? 'rgba(31,26,21,0.08)' : '#5B8E6F', border: 'none', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, fontWeight: 600, color: showDeposit ? '#4A4237' : '#FFFFFF' }}>
                  {showDeposit ? 'ביטול' : '+ הוסף'}
                </button>
              </div>
              {showDeposit && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} placeholder="סכום (₪)" style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1.5px solid rgba(91,142,111,0.3)', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 15, color: '#1F1A15', outline: 'none', background: '#FAFAF5' }} />
                  <button onClick={handleDeposit} style={{ background: '#5B8E6F', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 600 }}>שמור</button>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div style={{ background: 'rgba(255,255,255,0.75)', borderRadius: 18, padding: 16 }}>
              <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 700, color: '#1F1A15', marginBottom: 14 }}>ציר זמן</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {TIMELINE.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: i % 2 === 0 ? '#BEE3CB' : '#5B8E6F', flexShrink: 0 }} />
                    <div style={{ flex: 1, fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#4A4237' }}>{item.label}</div>
                    <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, fontWeight: 600, color: '#1F1A15' }}>₪{item.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fini tip */}
            <div style={{ marginTop: 14, background: '#FDDDE8', borderRadius: 16, padding: '14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <FiniAvatar size={28} mood="happy" />
              <div>
                <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, fontWeight: 700, color: '#C85A8A', marginBottom: 2 }}>טיפ מפיני</div>
                <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#1F1A15', lineHeight: 1.5 }}>
                  בקצב הנוכחי תגיעי ליעד ב-{goal.title} עוד כ-3 חודשים. העברת ₪500 נוספים בחודש תקצר את הזמן לחצי!
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <TabBar active="insights" onTab={t => nav(t)} />
    </div>
  )
}
