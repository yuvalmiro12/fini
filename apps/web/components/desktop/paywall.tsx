'use client'
import React, { useState } from 'react'
import { Icon } from '../ui/icon'
import { FiniMascot } from '../ui/fini-mascot'

/**
 * PaywallDesktop — upgrade pricing page.
 * Layout: hero with mascot + headline (full width) → 3-col plan grid → features.
 * Replaces the scrollable mobile paywall with a centered pricing layout.
 */

interface Props {
  nav: (screen: string) => void
  onSelectPlan: (plan: 'free' | 'pro' | 'proplus') => void
  currentPlan: 'free' | 'pro' | 'proplus'
}

const FEATURES = [
  { icon: 'sparkle', text: 'תובנות AI מתקדמות',           desc: 'ניתוח חכם של ההוצאות והצעות מותאמות אישית' },
  { icon: 'target',  text: 'מטרות חיסכון מרובות',         desc: 'נהל כמה יעדים במקביל עם מעקב אוטומטי' },
  { icon: 'users',   text: 'תקציב משותף עם בן/בת זוג',   desc: 'שתף תקציב והוצאות משותפות בזמן אמת' },
  { icon: 'trend',   text: 'דוחות ותחזיות פיננסיות',      desc: 'צפה במגמות והיכן אתה עומד בסוף החודש' },
  { icon: 'bell',    text: 'התראות חכמות בזמן אמת',      desc: 'קבל התרעות על חיובים חריגים מיידית' },
  { icon: 'lock',    text: 'גיבוי מאובטח בענן',          desc: 'הנתונים שלך מגובים ומוצפנים בכל זמן' },
]

const PLANS = [
  {
    id: 'free' as const,
    name: 'חינמי',
    price: '₪0',
    period: '/לעולם',
    tagline: 'התחלה טובה',
    features: ['מעקב עסקאות בסיסי', 'יעד חיסכון אחד', 'התראות כלליות', '30 יום היסטוריה'],
    cta: 'המשך בחינם',
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: '₪29',
    period: '/חודש',
    tagline: 'פופולרי ביותר',
    highlight: true,
    features: [
      'כל מה שבחינמי',
      'תובנות AI מתקדמות',
      'יעדי חיסכון ללא הגבלה',
      'תחזיות וסקירה חודשית',
      'היסטוריה ללא הגבלה',
    ],
    cta: 'התחל ניסיון — 14 ימים חינם',
  },
  {
    id: 'proplus' as const,
    name: 'Pro+',
    price: '₪59',
    period: '/חודש',
    tagline: 'למשפחות וזוגות',
    features: [
      'כל מה שב-Pro',
      'תקציב משותף לזוגות',
      'דוחות מותאמים אישית',
      'גיבוי ותמיכה מועדפת',
      'יצוא לאקסל / PDF',
    ],
    cta: 'התחל ניסיון — 14 ימים חינם',
  },
]

export function PaywallDesktop({ nav, onSelectPlan, currentPlan }: Props) {
  const [selected, setSelected] = useState<'pro' | 'proplus'>('pro')

  return (
    <div
      style={{
        padding: '24px 28px 80px',
        maxWidth: 1200,
        margin: '0 auto',
        direction: 'rtl',
        fontFamily: "'Rubik', system-ui, sans-serif",
      }}
    >
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FDDDE8 0%, #F9C6D7 100%)',
          borderRadius: 16,
          padding: '36px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: 30,
          marginBottom: 20,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -60,
            left: -60,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
          }}
        />
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <FiniMascot size={130} mood="wave" />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#C9A24D',
              color: '#FFFFFF',
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: 99,
              letterSpacing: 0.5,
            }}
          >
            PRO
          </div>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#1F1A15', margin: 0, letterSpacing: -0.5 }}>
            שדרג לפיני Pro
          </h2>
          <p style={{ fontSize: 15, color: '#4A4237', margin: '10px 0 0', lineHeight: 1.6, maxWidth: 520 }}>
            קבל תובנות AI מתקדמות, תקציב משותף לזוגות, ודוחות פיננסיים מלאים. התחל עם 14 ימי ניסיון חינמיים — ללא כרטיס אשראי.
          </p>
        </div>
      </div>

      {/* Plans grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        {PLANS.map((plan) => {
          const isSelected = plan.id !== 'free' && selected === plan.id
          const isCurrent = currentPlan === plan.id
          return (
            <div
              key={plan.id}
              onClick={() => plan.id !== 'free' && setSelected(plan.id as 'pro' | 'proplus')}
              style={{
                background: isSelected ? '#1F1A15' : '#FFFFFF',
                borderRadius: 16,
                padding: 24,
                position: 'relative',
                border: isSelected ? '2px solid #C85A8A' : '1px solid rgba(31,26,21,0.08)',
                cursor: plan.id === 'free' ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                color: isSelected ? '#F7F5E8' : '#1F1A15',
              }}
            >
              {plan.highlight && (
                <div
                  style={{
                    position: 'absolute',
                    top: -11,
                    right: 20,
                    background: '#C85A8A',
                    color: '#FFFFFF',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 99,
                    letterSpacing: 0.5,
                  }}
                >
                  פופולרי
                </div>
              )}
              <div style={{ fontSize: 11, fontWeight: 600, color: isSelected ? '#FDDDE8' : '#8A8070', letterSpacing: 0.5, marginBottom: 8, textTransform: 'uppercase' }}>
                {plan.tagline}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: isSelected ? '#F7F5E8' : '#1F1A15', marginBottom: 12, letterSpacing: -0.3 }}>
                {plan.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 18 }}>
                <span style={{ fontSize: 36, fontWeight: 700, color: isSelected ? '#C85A8A' : '#4A4237', letterSpacing: -1 }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: 13, color: isSelected ? 'rgba(253,221,232,0.7)' : '#8A8070' }}>{plan.period}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: isSelected ? 'rgba(200,90,138,0.25)' : '#DDEEDF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon name="check" size={11} color={isSelected ? '#FDDDE8' : '#5B8E6F'} />
                    </div>
                    <span style={{ fontSize: 13, color: isSelected ? 'rgba(247,245,232,0.9)' : '#4A4237' }}>{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectPlan(plan.id)
                }}
                disabled={isCurrent}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 10,
                  background: isCurrent
                    ? 'rgba(31,26,21,0.1)'
                    : isSelected
                    ? '#C85A8A'
                    : plan.id === 'free'
                    ? 'transparent'
                    : '#1F1A15',
                  color: isCurrent ? '#8A8070' : isSelected ? '#FFFFFF' : plan.id === 'free' ? '#4A4237' : '#F7F5E8',
                  border: plan.id === 'free' && !isSelected ? '1px solid rgba(31,26,21,0.15)' : 'none',
                  cursor: isCurrent ? 'not-allowed' : 'pointer',
                  fontFamily: "'Rubik', system-ui, sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {isCurrent ? 'התוכנית הנוכחית' : plan.cta}
              </button>
            </div>
          )
        })}
      </div>

      {/* Features grid */}
      <div style={{ marginBottom: 14, fontSize: 18, fontWeight: 700, color: '#1F1A15', letterSpacing: -0.3 }}>
        מה תקבל עם Pro
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {FEATURES.map((f, i) => (
          <div
            key={i}
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(31,26,21,0.06)',
              borderRadius: 12,
              padding: 18,
              display: 'flex',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: '#DDEEDF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name={f.icon} size={19} color="#5B8E6F" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1F1A15', marginBottom: 4 }}>{f.text}</div>
              <div style={{ fontSize: 12, color: '#8A8070', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
