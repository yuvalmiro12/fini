'use client'
import React, { useState } from 'react'
import { FiniMascot, FiniAvatar } from '../ui/fini-mascot'
import { Icon } from '../ui/icon'

interface ScreenProps {
  nav: (screen: string) => void
  onSelectPlan?: (plan: 'free' | 'pro' | 'proplus') => void
}

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 20 : 6,
            height: 6,
            borderRadius: 3,
            background: i === current ? '#C85A8A' : 'rgba(200,90,138,0.25)',
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  )
}

function FiniBubble({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, direction: 'rtl' }}>
      <FiniAvatar size={32} mood="talk" />
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px 20px 20px 6px',
          padding: '12px 16px',
          maxWidth: 240,
          fontFamily: "'Rubik', system-ui, sans-serif",
          fontSize: 14,
          color: '#1F1A15',
          lineHeight: 1.5,
          boxShadow: '0 2px 12px rgba(31,26,21,0.08)',
        }}
      >
        {text}
      </div>
    </div>
  )
}

function MeBubble({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', direction: 'rtl' }}>
      <div
        style={{
          background: '#C85A8A',
          borderRadius: '20px 20px 6px 20px',
          padding: '12px 16px',
          maxWidth: 240,
          fontFamily: "'Rubik', system-ui, sans-serif",
          fontSize: 14,
          color: '#FFFFFF',
          lineHeight: 1.5,
        }}
      >
        {text}
      </div>
    </div>
  )
}

function PinkButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        height: 56,
        borderRadius: 16,
        background: '#C85A8A',
        border: 'none',
        cursor: 'pointer',
        fontFamily: "'Rubik', system-ui, sans-serif",
        fontSize: 16,
        fontWeight: 600,
        color: '#FFFFFF',
        boxShadow: '0 8px 24px rgba(200,90,138,0.35)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseDown={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'
      }}
      onMouseUp={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
      }}
    >
      {label}
    </button>
  )
}

export function ObWelcome({ nav }: ScreenProps) {
  return (
    <div
      style={{
        flex: 1,
        background: '#FDDDE8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 24px 40px',
        position: 'relative',
        overflow: 'hidden',
        direction: 'rtl',
      }}
    >
      {/* Aurora glows */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 100, left: -80, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,198,215,0.6) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 180, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,90,138,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, paddingTop: 40 }}>
        <FiniMascot size={180} mood="wave" />

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 32, fontWeight: 700, color: '#1F1A15', margin: 0, marginBottom: 8 }}>
            שלום, אני פיני!
          </h1>
          <p style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 16, color: '#4A4237', margin: 0, lineHeight: 1.6 }}>
            העוזר הפיננסי האישי שלך.
            <br />
            ביחד נצליח לחסוך יותר ולהוציא פחות.
          </p>
        </div>

        <ProgressDots total={4} current={0} />
      </div>

      <PinkButton label="בואו נתחיל!" onClick={() => nav('obGoal')} />
    </div>
  )
}

const GOAL_OPTIONS = [
  { id: 'save', label: 'לחסוך יותר', emoji: '🐷' },
  { id: 'track', label: 'לעקוב אחרי הוצאות', emoji: '📊' },
  { id: 'budget', label: 'לנהל תקציב', emoji: '💰' },
  { id: 'debt', label: 'לצמצם חובות', emoji: '📉' },
]

export function ObGoal({ nav }: ScreenProps) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div
      style={{
        flex: 1,
        background: '#FDDDE8',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 24px 40px',
        position: 'relative',
        overflow: 'hidden',
        direction: 'rtl',
      }}
    >
      <div style={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.45) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FiniBubble text="מה המטרה הפיננסית העיקרית שלך?" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {GOAL_OPTIONS.map((opt) => {
            const isSelected = selected === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: 16,
                  border: `2px solid ${isSelected ? '#C85A8A' : 'rgba(31,26,21,0.1)'}`,
                  background: isSelected ? '#1F1A15' : 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: "'Rubik', system-ui, sans-serif",
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{opt.emoji}</span>
                  <span style={{ fontSize: 16, fontWeight: 500, color: isSelected ? '#F7F5E8' : '#1F1A15' }}>{opt.label}</span>
                </div>
                {isSelected && <Icon name="check" size={20} color="#C85A8A" />}
              </button>
            )
          })}
        </div>

        <div style={{ marginTop: 'auto' }}>
          <ProgressDots total={4} current={1} />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <PinkButton label="המשך" onClick={() => selected && nav('obIncome')} />
      </div>
    </div>
  )
}

const INCOME_OPTIONS = [
  { id: 'low', label: 'עד ₪6,000', value: '6000' },
  { id: 'mid', label: '₪6,000 – ₪12,000', value: '9000' },
  { id: 'high', label: '₪12,000 – ₪20,000', value: '16000' },
  { id: 'vhigh', label: 'מעל ₪20,000', value: '20000' },
]

export function ObIncome({ nav }: ScreenProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState('')

  return (
    <div
      style={{
        flex: 1,
        background: '#FDDDE8',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 24px 40px',
        position: 'relative',
        overflow: 'hidden',
        direction: 'rtl',
      }}
    >
      <div style={{ position: 'absolute', top: -60, right: -60, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 24 }}>
        <FiniBubble text="מה ההכנסה החודשית שלך? (בערך, לא חייב להיות מדויק)" />
        <MeBubble text="בטוח שהמידע שמור ופרטי 🔒" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {INCOME_OPTIONS.map((opt) => {
            const isSelected = selected === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: 14,
                  border: `2px solid ${isSelected ? '#C85A8A' : 'rgba(31,26,21,0.1)'}`,
                  background: isSelected ? '#C85A8A' : 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: "'Rubik', system-ui, sans-serif",
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? '#FFFFFF' : 'rgba(31,26,21,0.3)'}`,
                      background: isSelected ? '#FFFFFF' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#C85A8A' }} />}
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 500, color: isSelected ? '#FFFFFF' : '#1F1A15' }}>{opt.label}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Custom amount */}
        <div
          style={{
            background: 'rgba(255,255,255,0.8)',
            borderRadius: 14,
            padding: '12px 16px',
            border: '1.5px solid rgba(31,26,21,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 18, fontWeight: 600, color: '#4A4237' }}>₪</span>
          <input
            type="number"
            placeholder="הכנס סכום מדויק"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontFamily: "'Rubik', system-ui, sans-serif",
              fontSize: 15,
              color: '#1F1A15',
              outline: 'none',
              direction: 'rtl',
            }}
          />
        </div>

        <div style={{ marginTop: 'auto' }}>
          <ProgressDots total={4} current={2} />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <PinkButton label="המשך" onClick={() => nav('obPlan')} />
      </div>
    </div>
  )
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 'חינם',
    badge: null,
    features: ['מעקב הוצאות בסיסי', 'עד 50 עסקאות/חודש', 'צ\'אט מוגבל'],
    cta: 'התחל חינם',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₪29/חודש',
    badge: 'מומלץ',
    features: ['עסקאות ללא הגבלה', 'תובנות AI מתקדמות', 'מטרות חיסכון', 'תקציב זוגי'],
    cta: 'נסה 14 יום חינם',
    selected: true,
  },
  {
    id: 'proplus',
    name: 'Pro+',
    price: '₪59/חודש',
    badge: 'חדש',
    features: ['הכל ב-Pro', 'ייעוץ פיננסי AI', 'דוחות מתקדמים', 'תמיכה עדיפות'],
    cta: 'בחר Pro+',
  },
]

export function ObPlan({ nav, onSelectPlan }: ScreenProps) {
  const [selected, setSelected] = useState('pro')

  return (
    <div
      style={{
        flex: 1,
        background: '#FDDDE8',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 24px 40px',
        position: 'relative',
        overflow: 'hidden',
        direction: 'rtl',
      }}
    >
      <div style={{ position: 'absolute', bottom: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,90,138,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 24 }}>
        <FiniBubble text="בחר את התוכנית המתאימה לך" />

        <div style={{ display: 'flex', gap: 10 }}>
          {PLANS.map((plan) => {
            const isSelected = selected === plan.id
            return (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '16px 12px',
                  borderRadius: 16,
                  border: `2px solid ${isSelected ? '#C85A8A' : 'rgba(31,26,21,0.1)'}`,
                  background: isSelected ? '#1F1A15' : 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'right',
                  position: 'relative',
                }}
              >
                {plan.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -10,
                      right: 12,
                      background: '#C85A8A',
                      color: '#FFFFFF',
                      fontFamily: "'Rubik', system-ui, sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 99,
                    }}
                  >
                    {plan.badge}
                  </div>
                )}
                <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 700, color: isSelected ? '#F7F5E8' : '#1F1A15', marginBottom: 4 }}>{plan.name}</span>
                <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, fontWeight: 600, color: isSelected ? '#C85A8A' : '#4A4237', marginBottom: 8 }}>{plan.price}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {plan.features.map((f, i) => (
                    <span key={i} style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 11, color: isSelected ? '#8A8070' : '#4A4237', lineHeight: 1.4 }}>
                      · {f}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        <div style={{ marginTop: 'auto' }}>
          <ProgressDots total={4} current={3} />
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <PinkButton label={PLANS.find((p) => p.id === selected)?.cta || 'המשך'} onClick={() => { if (onSelectPlan) onSelectPlan(selected as 'free' | 'pro' | 'proplus'); else nav('chat') }} />
        <button
          onClick={() => { if (onSelectPlan) onSelectPlan('free'); else nav('chat') }}
          style={{
            background: 'transparent',
            border: 'none',
            fontFamily: "'Rubik', system-ui, sans-serif",
            fontSize: 13,
            color: '#8A8070',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          דלג לעכשיו
        </button>
      </div>
    </div>
  )
}
