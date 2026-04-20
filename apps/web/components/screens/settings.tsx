'use client'
import React, { useState } from 'react'
import { FiniMascot } from '../ui/fini-mascot'
import { Icon } from '../ui/icon'
import { StatusBar } from '../ui/status-bar'

interface SettingsProps {
  nav: (screen: string) => void
  plan: 'free' | 'pro' | 'proplus'
  userName: string
  onUpdateName: (name: string) => void
  onReset: () => void
  onUpgrade: () => void
}

const PLAN_LABELS = { free: 'חינמי', pro: 'Pro', proplus: 'Pro+' }
const PLAN_COLORS = { free: '#8A8070', pro: '#C85A8A', proplus: '#C9A24D' }

function SettingRow({ icon, label, value, onPress, danger = false, rightEl }: {
  icon: string; label: string; value?: string; onPress?: () => void; danger?: boolean; rightEl?: React.ReactNode
}) {
  return (
    <button
      onClick={onPress}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(31,26,21,0.05)', cursor: onPress ? 'pointer' : 'default', width: '100%', direction: 'rtl', textAlign: 'right' }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 10, background: danger ? '#FADEDC' : 'rgba(31,26,21,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={icon} size={18} color={danger ? '#D47070' : '#4A4237'} />
      </div>
      <span style={{ flex: 1, fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 500, color: danger ? '#D47070' : '#1F1A15' }}>{label}</span>
      {rightEl || (value && <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#8A8070' }}>{value}</span>)}
      {onPress && !rightEl && <Icon name="arrow" size={16} color="#C0B8AD" />}
    </button>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{ width: 44, height: 26, borderRadius: 13, background: value ? '#5B8E6F' : 'rgba(31,26,21,0.15)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
    >
      <div style={{ position: 'absolute', top: 3, right: value ? 3 : 'auto', left: value ? 'auto' : 3, width: 20, height: 20, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 1px 4px rgba(31,26,21,0.2)', transition: 'all 0.2s' }} />
    </div>
  )
}

export function Settings({ nav, plan, userName, onUpdateName, onReset, onUpgrade }: SettingsProps) {
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(userName)
  const [notifications, setNotifications] = useState(true)
  const [couples, setCouples] = useState(true)
  const [faceId, setFaceId] = useState(false)

  const handleSaveName = () => {
    if (nameInput.trim()) { onUpdateName(nameInput.trim()); setEditingName(false) }
  }

  const handleReset = () => {
    if (window.confirm('לאפס את כל הנתונים? הפעולה אינה הפיכה.')) onReset()
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F7F5E8', direction: 'rtl', overflow: 'hidden' }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '4px 16px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => nav('chat')} style={{ background: 'rgba(31,26,21,0.06)', border: 'none', borderRadius: 12, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#1F1A15' }}>
          <Icon name="arrowL" size={16} color="#1F1A15" />
          חזור
        </button>
        <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 18, fontWeight: 700, color: '#1F1A15' }}>הגדרות</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 40px' }}>
        {/* Profile card */}
        <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 20, padding: 20, marginBottom: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #FDDDE8, #C85A8A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 32, fontWeight: 700, color: '#FFFFFF' }}>{userName[0]}</span>
          </div>
          {editingName ? (
            <div style={{ display: 'flex', gap: 8, width: '100%' }}>
              <input value={nameInput} onChange={e => setNameInput(e.target.value)} autoFocus style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1.5px solid #C85A8A', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 15, color: '#1F1A15', outline: 'none', direction: 'rtl', background: '#FAFAF5' }} />
              <button onClick={handleSaveName} style={{ background: '#C85A8A', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 14px', cursor: 'pointer', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 600 }}>שמור</button>
              <button onClick={() => setEditingName(false)} style={{ background: 'rgba(31,26,21,0.06)', border: 'none', borderRadius: 10, padding: '10px 12px', cursor: 'pointer' }}><Icon name="close" size={16} color="#4A4237" /></button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 20, fontWeight: 700, color: '#1F1A15' }}>{userName}</div>
              <button onClick={() => setEditingName(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#C85A8A', marginTop: 4 }}>✏️ ערוך שם</button>
            </div>
          )}

          {/* Plan badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: '6px 14px', borderRadius: 99, background: plan === 'free' ? 'rgba(31,26,21,0.08)' : 'linear-gradient(135deg, #FDDDE8, #C85A8A)', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, fontWeight: 700, color: plan === 'free' ? '#4A4237' : '#FFFFFF' }}>
              {PLAN_LABELS[plan]}
            </div>
            {plan === 'free' && (
              <button onClick={onUpgrade} style={{ background: '#1F1A15', border: 'none', borderRadius: 99, padding: '6px 14px', cursor: 'pointer', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, fontWeight: 600, color: '#F7F5E8' }}>
                שדרג ל-Pro
              </button>
            )}
          </div>
        </div>

        {/* Preferences */}
        <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 18, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ padding: '12px 16px', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, fontWeight: 600, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.5 }}>העדפות</div>
          <SettingRow icon="bell" label="התראות" rightEl={<Toggle value={notifications} onChange={setNotifications} />} />
          <SettingRow icon="users" label="מצב זוגות" rightEl={<Toggle value={couples} onChange={setCouples} />} />
          <SettingRow icon="lock" label="Face ID / Touch ID" rightEl={<Toggle value={faceId} onChange={setFaceId} />} />
          <SettingRow icon="globe" label="שפה" value="עברית" />
        </div>

        {/* Account */}
        <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 18, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ padding: '12px 16px', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, fontWeight: 600, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.5 }}>חשבון</div>
          <SettingRow icon="lock" label="פרטיות ואבטחה" onPress={() => {}} />
          <SettingRow icon="receipt" label="היסטוריית תשלומים" onPress={() => nav('paywall')} />
          <SettingRow icon="sparkle" label="שדרג את הפלאן" onPress={onUpgrade} />
        </div>

        {/* About */}
        <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 18, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ padding: '12px 16px', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, fontWeight: 600, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.5 }}>אודות</div>
          <SettingRow icon="sparkle" label="פיני" value="גרסה 1.0.0" />
          <SettingRow icon="heart" label="שתף עם חברים" onPress={() => {}} />
          <SettingRow icon="check" label="תנאי שימוש" onPress={() => {}} />
        </div>

        {/* Fini mascot */}
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <FiniMascot size={80} mood="wink" />
          <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#8A8070', marginTop: 8 }}>פיני כאן בשבילך 🌟</div>
        </div>

        {/* Reset */}
        <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 18, overflow: 'hidden' }}>
          <SettingRow icon="close" label="איפוס האפליקציה" onPress={handleReset} danger />
        </div>
      </div>
    </div>
  )
}
