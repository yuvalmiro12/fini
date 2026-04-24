'use client'
import React, { useState } from 'react'
import { Icon } from '../ui/icon'
import { FiniAvatar } from '../ui/fini-mascot'
import { CatIcon } from '../ui/cat-icon'
import { SHARED_BUDGET } from '../../lib/seed'

/**
 * CouplesDesktop — shared budget dashboard.
 * Layout: 2-col. Left: members hero + budget progress + transactions table.
 * Right: invite card, split breakdown, fini tip.
 */

interface Props {
  nav: (screen: string) => void
}

export function CouplesDesktop({ nav }: Props) {
  const budget = SHARED_BUDGET
  const spentPct = Math.round((budget.spent / budget.total) * 100)
  const remaining = Math.max(budget.total - budget.spent, 0)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteSent, setInviteSent] = useState(false)

  const handleInvite = () => {
    if (inviteEmail.includes('@')) {
      setInviteSent(true)
      setInviteEmail('')
    }
  }

  // Split breakdown — by member (evenly for demo)
  const split = budget.members.map((m, i) => ({
    ...m,
    spent: Math.round(budget.spent * (i === 0 ? 0.58 : 0.42)),
  }))

  return (
    <div
      style={{
        padding: '24px 28px 80px',
        maxWidth: 1200,
        margin: '0 auto',
        direction: 'rtl',
        fontFamily: "'Rubik', system-ui, sans-serif",
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 18,
      }}
    >
      {/* Left column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Members hero */}
        <div
          style={{
            background: 'linear-gradient(135deg, #5A6FB8 0%, #3F50A0 100%)',
            borderRadius: 16,
            padding: 26,
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -50,
              left: -50,
              width: 180,
              height: 180,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
            }}
          />

          {/* Avatar stack */}
          <div style={{ position: 'relative', height: 90, width: 146, flexShrink: 0 }}>
            {budget.members.map((m, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  right: i * 50,
                  width: 86,
                  height: 86,
                  borderRadius: '50%',
                  background: m.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '4px solid #3F50A0',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                }}
              >
                <span style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF' }}>{m.initial}</span>
              </div>
            ))}
          </div>

          {/* Names + stats */}
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.75)', letterSpacing: 0.4, marginBottom: 6, textTransform: 'uppercase' }}>
              תקציב משותף
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, letterSpacing: -0.3 }}>
              {budget.members.map((m, i) => (
                <span key={i}>
                  {m.name}
                  {i < budget.members.length - 1 && <span style={{ color: 'rgba(255,255,255,0.6)' }}> & </span>}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 6 }}>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>תקציב חודשי</div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>₪{budget.total.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>הוצא</div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>₪{budget.spent.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>נותר</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#BEE3CB', letterSpacing: -0.5 }}>
                  ₪{remaining.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(31,26,21,0.06)',
            borderRadius: 14,
            padding: 22,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: '#8A8070', fontWeight: 500, marginBottom: 2 }}>התקדמות חודשית</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1F1A15' }}>
                ₪{budget.spent.toLocaleString()} <span style={{ fontSize: 13, color: '#8A8070', fontWeight: 500 }}>מתוך ₪{budget.total.toLocaleString()}</span>
              </div>
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: spentPct > 80 ? '#D47070' : '#5A6FB8',
                padding: '4px 10px',
                borderRadius: 99,
                background: spentPct > 80 ? '#FADEDC' : '#E8ECFF',
              }}
            >
              {spentPct}%
            </div>
          </div>
          <div style={{ background: 'rgba(31,26,21,0.06)', borderRadius: 99, height: 10, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${Math.min(spentPct, 100)}%`,
                background: spentPct > 80 ? '#D47070' : '#5A6FB8',
                borderRadius: 99,
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </div>

        {/* Transactions table */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(31,26,21,0.06)',
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(31,26,21,0.05)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1F1A15' }}>עסקאות משותפות</div>
            <span style={{ fontSize: 12, color: '#8A8070' }}>{budget.transactions.length} פריטים</span>
          </div>

          {/* Header row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '44px 1fr 160px 120px 120px',
              gap: 12,
              padding: '10px 20px',
              background: '#FAFAF5',
              borderBottom: '1px solid rgba(31,26,21,0.05)',
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
          </div>

          {budget.transactions.map((tx, i) => (
            <div
              key={tx.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '44px 1fr 160px 120px 120px',
                gap: 12,
                padding: '14px 20px',
                borderBottom:
                  i < budget.transactions.length - 1 ? '1px solid rgba(31,26,21,0.04)' : 'none',
                alignItems: 'center',
              }}
            >
              <CatIcon cat={tx.category} size={34} radius={9} />
              <div style={{ fontSize: 14, fontWeight: 500, color: '#1F1A15' }}>{tx.title}</div>
              <div style={{ fontSize: 12, color: '#4A4237' }}>{tx.category}</div>
              <div style={{ fontSize: 12, color: '#8A8070' }}>{tx.date}</div>
              <div style={{ textAlign: 'left', fontSize: 14, fontWeight: 700, color: '#D47070' }}>
                -₪{tx.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Invite card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(31,26,21,0.06)',
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: '#E8ECFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="users" size={19} color="#5A6FB8" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1F1A15' }}>הזמן בן/בת זוג</div>
              <div style={{ fontSize: 11, color: '#8A8070' }}>שתף את התקציב המשותף</div>
            </div>
          </div>

          {inviteSent ? (
            <div
              style={{
                background: '#DDEEDF',
                borderRadius: 10,
                padding: '12px 14px',
                fontSize: 13,
                color: '#5B8E6F',
                textAlign: 'center',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Icon name="check" size={15} color="#5B8E6F" />
              הזמנה נשלחה בהצלחה
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="כתובת אימייל..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid rgba(31,26,21,0.1)',
                  fontFamily: "'Rubik', system-ui, sans-serif",
                  fontSize: 13,
                  color: '#1F1A15',
                  outline: 'none',
                  background: '#FAFAF5',
                  direction: 'rtl',
                  boxSizing: 'border-box',
                }}
              />
              <button
                onClick={handleInvite}
                disabled={!inviteEmail.includes('@')}
                style={{
                  padding: '10px',
                  borderRadius: 10,
                  background: inviteEmail.includes('@') ? '#5A6FB8' : 'rgba(90,111,184,0.35)',
                  color: '#fff',
                  border: 'none',
                  cursor: inviteEmail.includes('@') ? 'pointer' : 'not-allowed',
                  fontFamily: "'Rubik', system-ui, sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                שלח הזמנה
              </button>
            </div>
          )}
        </div>

        {/* Split breakdown */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(31,26,21,0.06)',
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1F1A15', marginBottom: 14 }}>חלוקה</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {split.map((m, i) => {
              const memberPct = Math.round((m.spent / Math.max(budget.spent, 1)) * 100)
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: m.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF' }}>{m.initial}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#1F1A15' }}>{m.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#4A4237' }}>₪{m.spent.toLocaleString()}</span>
                  </div>
                  <div style={{ background: 'rgba(31,26,21,0.06)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${memberPct}%`,
                        background: m.color,
                        borderRadius: 99,
                        transition: 'width 0.6s ease',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Fini tip */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FDDDE8 0%, #F9C6D7 100%)',
            borderRadius: 14,
            padding: 20,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}
        >
          <FiniAvatar size={36} mood="happy" />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#C85A8A', letterSpacing: 0.3, marginBottom: 4 }}>טיפ מפיני</div>
            <div style={{ fontSize: 13, color: '#1F1A15', lineHeight: 1.5 }}>
              הוצאות הבית שלכם גבוהות ב-12% לעומת החודש שעבר. כדאי לבדוק את חשבון החשמל.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
