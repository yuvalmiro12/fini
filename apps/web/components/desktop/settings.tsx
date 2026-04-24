'use client'
import React, { useState } from 'react'
import { Icon } from '../ui/icon'
import { FiniMascot } from '../ui/fini-mascot'

/**
 * SettingsDesktop — 2-column sectioned settings.
 * Left: profile card (hero) + plan + sign-out zone.
 * Right: preferences/account/about cards, each a sectioned table.
 */

interface Props {
  nav: (screen: string) => void
  plan: 'free' | 'pro' | 'proplus'
  userName: string
  onUpdateName: (name: string) => void
  onReset: () => void
  onUpgrade: () => void
}

const PLAN_LABELS = { free: 'חינמי', pro: 'Pro', proplus: 'Pro+' }

function SettingRow({
  icon,
  label,
  value,
  onPress,
  danger = false,
  rightEl,
  isLast = false,
}: {
  icon: string
  label: string
  value?: string
  onPress?: () => void
  danger?: boolean
  rightEl?: React.ReactNode
  isLast?: boolean
}) {
  return (
    <button
      onClick={onPress}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 18px',
        background: 'transparent',
        border: 'none',
        borderBottom: isLast ? 'none' : '1px solid rgba(31,26,21,0.05)',
        cursor: onPress ? 'pointer' : 'default',
        width: '100%',
        direction: 'rtl',
        textAlign: 'right',
        fontFamily: "'Rubik', system-ui, sans-serif",
        transition: 'background 0.12s ease',
      }}
      onMouseEnter={(e) => {
        if (onPress) e.currentTarget.style.background = '#FAFAF5'
      }}
      onMouseLeave={(e) => {
        if (onPress) e.currentTarget.style.background = 'transparent'
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: danger ? '#FADEDC' : 'rgba(31,26,21,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={17} color={danger ? '#D47070' : '#4A4237'} />
      </div>
      <span
        style={{
          flex: 1,
          fontSize: 14,
          fontWeight: 500,
          color: danger ? '#D47070' : '#1F1A15',
        }}
      >
        {label}
      </span>
      {rightEl ||
        (value && (
          <span style={{ fontSize: 13, color: '#8A8070' }}>{value}</span>
        ))}
      {onPress && !rightEl && <Icon name="chevron-left" size={15} color="#C0B8AD" />}
    </button>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onChange(!value)
      }}
      style={{
        width: 40,
        height: 24,
        borderRadius: 12,
        background: value ? '#5B8E6F' : 'rgba(31,26,21,0.15)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 3,
          right: value ? 3 : 'auto',
          left: value ? 'auto' : 3,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(31,26,21,0.2)',
          transition: 'all 0.2s',
        }}
      />
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(31,26,21,0.06)',
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '14px 18px 10px',
          fontSize: 11,
          fontWeight: 600,
          color: '#8A8070',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          borderBottom: '1px solid rgba(31,26,21,0.05)',
          background: '#FAFAF5',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

export function SettingsDesktop({ nav, plan, userName, onUpdateName, onReset, onUpgrade }: Props) {
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(userName)
  const [notifications, setNotifications] = useState(true)
  const [couples, setCouples] = useState(true)
  const [faceId, setFaceId] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim())
      setEditingName(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('לאפס את כל הנתונים? הפעולה אינה הפיכה.')) onReset()
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
        gridTemplateColumns: '340px 1fr',
        gap: 18,
      }}
    >
      {/* Left column — profile card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(31,26,21,0.06)',
            borderRadius: 14,
            padding: 24,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FDDDE8, #C85A8A)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            <span style={{ fontSize: 38, fontWeight: 700, color: '#FFFFFF' }}>{userName[0]}</span>
          </div>

          {editingName ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid #C85A8A',
                  fontFamily: "'Rubik', system-ui, sans-serif",
                  fontSize: 16,
                  color: '#1F1A15',
                  outline: 'none',
                  direction: 'rtl',
                  background: '#FAFAF5',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleSaveName}
                  style={{
                    flex: 1,
                    background: '#C85A8A',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px',
                    cursor: 'pointer',
                    fontFamily: "'Rubik', system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  שמור
                </button>
                <button
                  onClick={() => {
                    setEditingName(false)
                    setNameInput(userName)
                  }}
                  style={{
                    background: 'rgba(31,26,21,0.05)',
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontFamily: "'Rubik', system-ui, sans-serif",
                    fontSize: 14,
                    color: '#4A4237',
                  }}
                >
                  ביטול
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1F1A15', letterSpacing: -0.3 }}>{userName}</div>
              <button
                onClick={() => setEditingName(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Rubik', system-ui, sans-serif",
                  fontSize: 13,
                  color: '#C85A8A',
                  marginTop: 4,
                  fontWeight: 500,
                }}
              >
                ערוך שם
              </button>
            </>
          )}

          {/* Plan badge */}
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                padding: '6px 16px',
                borderRadius: 99,
                background:
                  plan === 'free' ? 'rgba(31,26,21,0.08)' : 'linear-gradient(135deg, #FDDDE8, #C85A8A)',
                fontSize: 12,
                fontWeight: 700,
                color: plan === 'free' ? '#4A4237' : '#FFFFFF',
                letterSpacing: 0.3,
              }}
            >
              {PLAN_LABELS[plan]}
            </div>
            {plan === 'free' && (
              <button
                onClick={onUpgrade}
                style={{
                  background: '#1F1A15',
                  border: 'none',
                  borderRadius: 10,
                  padding: '10px 18px',
                  cursor: 'pointer',
                  fontFamily: "'Rubik', system-ui, sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#F7F5E8',
                }}
              >
                שדרג ל-Pro
              </button>
            )}
          </div>
        </div>

        {/* Mascot card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FDDDE8 0%, #F9C6D7 100%)',
            borderRadius: 14,
            padding: 22,
            textAlign: 'center',
          }}
        >
          <FiniMascot size={72} mood="wink" />
          <div style={{ fontSize: 13, color: '#4A4237', marginTop: 10, fontWeight: 500 }}>
            פיני כאן בשבילך
          </div>
          <div style={{ fontSize: 11, color: '#8A8070', marginTop: 4 }}>גרסה 1.0.0</div>
        </div>
      </div>

      {/* Right column — sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SectionCard title="העדפות">
          <SettingRow
            icon="bell"
            label="התראות"
            rightEl={<Toggle value={notifications} onChange={setNotifications} />}
          />
          <SettingRow
            icon="users"
            label="מצב זוגות"
            rightEl={<Toggle value={couples} onChange={setCouples} />}
          />
          <SettingRow
            icon="lock"
            label="Face ID / Touch ID"
            rightEl={<Toggle value={faceId} onChange={setFaceId} />}
          />
          <SettingRow
            icon="sparkle"
            label="מצב כהה"
            rightEl={<Toggle value={darkMode} onChange={setDarkMode} />}
          />
          <SettingRow icon="globe" label="שפה" value="עברית" isLast />
        </SectionCard>

        <SectionCard title="חשבון">
          <SettingRow icon="lock" label="פרטיות ואבטחה" onPress={() => {}} />
          <SettingRow icon="receipt" label="היסטוריית תשלומים" onPress={() => nav('paywall')} />
          <SettingRow icon="sparkle" label="שדרג את הפלאן" onPress={onUpgrade} isLast />
        </SectionCard>

        <SectionCard title="אודות">
          <SettingRow icon="sparkle" label="פיני" value="גרסה 1.0.0" />
          <SettingRow icon="heart" label="שתף עם חברים" onPress={() => {}} />
          <SettingRow icon="check" label="תנאי שימוש" onPress={() => {}} />
          <SettingRow icon="globe" label="מדיניות פרטיות" onPress={() => {}} isLast />
        </SectionCard>

        <SectionCard title="אזור סכנה">
          <SettingRow icon="close" label="איפוס האפליקציה" onPress={handleReset} danger isLast />
        </SectionCard>
      </div>
    </div>
  )
}
