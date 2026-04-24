'use client'
import React, { useState } from 'react'
import { Icon } from '../ui/icon'
import { FiniAvatar } from '../ui/fini-mascot'
import type { SavingsGoal as SavingsGoalType } from '../../lib/seed'

/**
 * SavingsGoalDesktop — goal hero + stats + deposit + timeline.
 * Layout: 2-col grid (5fr progress/stats/deposit | 4fr timeline/tip/history).
 * Inline edit mode swaps the hero card contents; no back button (sidebar nav).
 */

interface Props {
  nav: (screen: string) => void
  savingsGoal: SavingsGoalType
  onUpdate: (goal: SavingsGoalType) => void
}

const TIMELINE = [
  { label: 'פברואר', amount: 1500, date: '15/2' },
  { label: 'מרץ',   amount: 2200, date: '10/3' },
  { label: 'אפריל', amount: 1800, date: '05/4' },
  { label: 'מאי',   amount: 2900, date: '20/5' },
]

const MILESTONES = [
  { pct: 25, label: '25% — רבע הדרך' },
  { pct: 50, label: '50% — חצי הדרך' },
  { pct: 75, label: '75% — כמעט שם' },
  { pct: 100, label: '100% — יעד הושלם' },
]

export function SavingsGoalDesktop({ nav, savingsGoal, onUpdate }: Props) {
  const [goal, setGoal] = useState(savingsGoal)
  const [editMode, setEditMode] = useState(false)
  const [editTarget, setEditTarget] = useState(String(goal.target))
  const [editTitle, setEditTitle] = useState(goal.title)
  const [depositAmount, setDepositAmount] = useState('')

  const pct = Math.round((goal.current / goal.target) * 100)
  const circumference = 2 * Math.PI * 90
  const dashOffset = circumference * (1 - Math.min(pct, 100) / 100)

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
    }
  }

  return (
    <div
      style={{
        padding: '24px 28px 80px',
        maxWidth: 1200,
        margin: '0 auto',
        direction: 'rtl',
        fontFamily: "'Rubik', system-ui, sans-serif",
        display: 'grid',
        gridTemplateColumns: '5fr 4fr',
        gap: 18,
      }}
    >
      {/* Left column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Hero progress card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #5B8E6F 0%, #3D6B53 100%)',
            borderRadius: 16,
            padding: 28,
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -60,
              left: -60,
              width: 220,
              height: 220,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -80,
              right: -40,
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
            }}
          />

          {editMode ? (
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.3, marginBottom: 14 }}>
                עריכת יעד חיסכון
              </div>
              <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>שם היעד</label>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.3)',
                  fontFamily: "'Rubik', system-ui, sans-serif",
                  fontSize: 15,
                  color: '#FFFFFF',
                  outline: 'none',
                  direction: 'rtl',
                  background: 'rgba(255,255,255,0.12)',
                  marginBottom: 14,
                  boxSizing: 'border-box',
                }}
              />
              <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>סכום יעד (₪)</label>
              <input
                type="number"
                value={editTarget}
                onChange={(e) => setEditTarget(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.3)',
                  fontFamily: "'Rubik', system-ui, sans-serif",
                  fontSize: 15,
                  color: '#FFFFFF',
                  outline: 'none',
                  background: 'rgba(255,255,255,0.12)',
                  marginBottom: 18,
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleSaveEdit}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: 10,
                    background: '#FFFFFF',
                    color: '#3D6B53',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Rubik', system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  שמור שינויים
                </button>
                <button
                  onClick={() => {
                    setEditMode(false)
                    setEditTitle(goal.title)
                    setEditTarget(String(goal.target))
                  }}
                  style={{
                    padding: '11px 18px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.15)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255,255,255,0.25)',
                    cursor: 'pointer',
                    fontFamily: "'Rubik', system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  ביטול
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', position: 'relative' }}>
              {/* Ring */}
              <div style={{ position: 'relative', width: 200, height: 200, flexShrink: 0 }}>
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="12" />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#BEE3CB"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    transform="rotate(-90 100 100)"
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1, lineHeight: 1 }}>{pct}%</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>הושלם</span>
                </div>
              </div>

              {/* Meta */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Icon name="target" size={16} color="rgba(255,255,255,0.85)" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.3 }}>יעד חיסכון פעיל</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5, marginBottom: 6, lineHeight: 1.15 }}>{goal.title}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 18 }}>עד {goal.deadline}</div>
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5, marginBottom: 2 }}>
                  ₪{goal.current.toLocaleString()}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                  מתוך ₪{goal.target.toLocaleString()}
                </div>
                <button
                  onClick={() => {
                    setEditMode(true)
                    setEditTitle(goal.title)
                    setEditTarget(String(goal.target))
                  }}
                  style={{
                    marginTop: 18,
                    padding: '9px 16px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.18)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255,255,255,0.25)',
                    cursor: 'pointer',
                    fontFamily: "'Rubik', system-ui, sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Icon name="settings" size={14} color="#FFFFFF" />
                  ערוך יעד
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3 stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'נצבר',  value: goal.current,                 color: '#5B8E6F', icon: 'piggy' },
            { label: 'יעד',   value: goal.target,                  color: '#1F1A15', icon: 'target' },
            { label: 'נותר',  value: Math.max(goal.target - goal.current, 0), color: '#C85A8A', icon: 'trend' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(31,26,21,0.06)',
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: stat.color + '18',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name={stat.icon} size={15} color={stat.color} />
                </div>
                <span style={{ fontSize: 12, color: '#8A8070', fontWeight: 500 }}>{stat.label}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: stat.color, letterSpacing: -0.5 }}>
                ₪{stat.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Deposit form */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(31,26,21,0.06)',
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1F1A15', marginBottom: 2 }}>הוסף לחיסכון</div>
              <div style={{ fontSize: 12, color: '#8A8070' }}>כל הפקדה מקרבת אותך ליעד</div>
            </div>
            <Icon name="piggy" size={22} color="#5B8E6F" />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="סכום הפקדה (₪)"
              style={{
                flex: 1,
                padding: '11px 14px',
                borderRadius: 10,
                border: '1px solid rgba(31,26,21,0.1)',
                fontFamily: "'Rubik', system-ui, sans-serif",
                fontSize: 15,
                color: '#1F1A15',
                outline: 'none',
                background: '#FAFAF5',
                direction: 'rtl',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#5B8E6F')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(31,26,21,0.1)')}
            />
            {[100, 500, 1000].map((preset) => (
              <button
                key={preset}
                onClick={() => setDepositAmount(String(preset))}
                style={{
                  padding: '11px 14px',
                  borderRadius: 10,
                  border: '1px solid rgba(31,26,21,0.08)',
                  background: '#FAFAF5',
                  cursor: 'pointer',
                  fontFamily: "'Rubik', system-ui, sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#4A4237',
                }}
              >
                ₪{preset}
              </button>
            ))}
            <button
              onClick={handleDeposit}
              disabled={!depositAmount || Number(depositAmount) <= 0}
              style={{
                padding: '11px 22px',
                borderRadius: 10,
                background: !depositAmount || Number(depositAmount) <= 0 ? 'rgba(91,142,111,0.35)' : '#5B8E6F',
                color: '#FFFFFF',
                border: 'none',
                cursor: !depositAmount || Number(depositAmount) <= 0 ? 'not-allowed' : 'pointer',
                fontFamily: "'Rubik', system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              הפקד
            </button>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Fini tip */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FDDDE8 0%, #F9C6D7 100%)',
            borderRadius: 14,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FiniAvatar size={36} mood="happy" />
            <div style={{ fontSize: 13, fontWeight: 700, color: '#C85A8A', letterSpacing: 0.3 }}>טיפ מפיני</div>
          </div>
          <div style={{ fontSize: 14, color: '#1F1A15', lineHeight: 1.5 }}>
            בקצב הנוכחי תגיעי ליעד {goal.title} עוד כ־3 חודשים. העברה של ₪500 נוספים בחודש תקצר את הזמן לחצי!
          </div>
        </div>

        {/* Milestones */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(31,26,21,0.06)',
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1F1A15', marginBottom: 14 }}>אבני דרך</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MILESTONES.map((m) => {
              const reached = pct >= m.pct
              return (
                <div
                  key={m.pct}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    background: reached ? '#DDEEDF' : '#FAFAF5',
                    borderRadius: 10,
                    border: reached ? '1px solid rgba(91,142,111,0.2)' : '1px solid rgba(31,26,21,0.05)',
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: reached ? '#5B8E6F' : 'rgba(31,26,21,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {reached && <Icon name="check" size={14} color="#FFFFFF" />}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      fontSize: 13,
                      fontWeight: reached ? 600 : 500,
                      color: reached ? '#1F1A15' : '#8A8070',
                    }}
                  >
                    {m.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Timeline history */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(31,26,21,0.06)',
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1F1A15' }}>היסטוריית הפקדות</div>
            <span style={{ fontSize: 11, color: '#8A8070' }}>{TIMELINE.length} רשומות</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TIMELINE.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: i < TIMELINE.length - 1 ? '1px solid rgba(31,26,21,0.05)' : 'none',
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: '#DDEEDF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon name="piggy" size={17} color="#5B8E6F" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1F1A15' }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: '#8A8070', marginTop: 1 }}>{item.date}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#5B8E6F' }}>
                  +₪{item.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
