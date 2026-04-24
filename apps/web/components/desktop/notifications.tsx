'use client'
import React, { useState } from 'react'
import { Icon } from '../ui/icon'
import { FiniAvatar } from '../ui/fini-mascot'

/**
 * NotificationsDesktop — list with filter rail + read-all.
 * Layout: 200px filter sidebar (all/unread/read) + main list.
 * Replaces the mobile stacked cards with a cleaner inbox-style layout.
 */

interface Props {
  nav: (screen: string) => void
  prevScreen?: string
}

interface Notification {
  id: string
  icon: string
  iconBg: string
  iconColor: string
  title: string
  body: string
  time: string
  read: boolean
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', icon: 'bolt',    iconBg: '#F3E7C7', iconColor: '#C9A24D', title: 'חיוב גבוה זוהה',     body: 'חשמל ומים — ₪340, גבוה ב-23% מהחודש שעבר.',  time: 'לפני שעה',   read: false },
  { id: 'n2', icon: 'target',  iconBg: '#D6EEE0', iconColor: '#5B8E6F', title: 'יעד חיסכון — 56%',   body: 'כל הכבוד! צעד אחד נוסף ואת שם.',             time: 'לפני 3 שעות', read: false },
  { id: 'n3', icon: 'sparkle', iconBg: '#FDDDE8', iconColor: '#C85A8A', title: 'תובנה חדשה מפיני',   body: 'הוצאות האוכל שלך ירדו ב-8% — סו טוב!',        time: 'אתמול',       read: false },
  { id: 'n4', icon: 'cart',    iconBg: '#FADEDC', iconColor: '#D47070', title: 'חרגת מתקציב קניות', body: 'הוצאת ₪450 על קניות — מעל התקציב החודשי שלך.', time: 'אתמול',       read: true  },
  { id: 'n5', icon: 'users',   iconBg: '#E8ECFF', iconColor: '#5A6FB8', title: 'תקציב משותף עודכן', body: 'יונתן הוסיף הוצאה: ארנונה ₪780.',             time: 'לפני 3 ימים', read: true  },
  { id: 'n6', icon: 'trend',   iconBg: '#D6EEE0', iconColor: '#5B8E6F', title: 'סיכום שבועי מוכן', body: 'הוצאות השבוע: ₪816. לחץ לצפייה בפירוט.',       time: 'לפני 5 ימים', read: true  },
]

export function NotificationsDesktop({ nav }: Props) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  const unread = notifications.filter((n) => !n.read).length
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  const markRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  const dismiss = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id))

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read
    if (filter === 'read') return n.read
    return true
  })

  const filterOpts = [
    { key: 'all' as const,    label: 'הכל',     count: notifications.length },
    { key: 'unread' as const, label: 'לא נקרא', count: unread },
    { key: 'read' as const,   label: 'נקרא',    count: notifications.length - unread },
  ]

  return (
    <div
      style={{
        padding: '24px 28px 80px',
        maxWidth: 1100,
        margin: '0 auto',
        direction: 'rtl',
        fontFamily: "'Rubik', system-ui, sans-serif",
        display: 'grid',
        gridTemplateColumns: '200px 1fr',
        gap: 18,
        alignItems: 'start',
      }}
    >
      {/* Filter sidebar */}
      <aside
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(31,26,21,0.06)',
          borderRadius: 14,
          padding: 14,
          position: 'sticky',
          top: 80,
        }}
      >
        <div style={{ fontSize: 12, color: '#8A8070', fontWeight: 600, marginBottom: 10, letterSpacing: 0.3 }}>סינון</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filterOpts.map((opt) => {
            const active = filter === opt.key
            return (
              <button
                key={opt.key}
                onClick={() => setFilter(opt.key)}
                style={{
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  background: active ? 'rgba(200,90,138,0.08)' : 'transparent',
                  color: active ? '#C85A8A' : '#4A4237',
                  fontFamily: "'Rubik', system-ui, sans-serif",
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  direction: 'rtl',
                }}
              >
                <span>{opt.label}</span>
                <span style={{ fontSize: 11, color: active ? '#C85A8A' : '#8A8070' }}>{opt.count}</span>
              </button>
            )
          })}
        </div>

        {unread > 0 && (
          <button
            onClick={markAllRead}
            style={{
              marginTop: 14,
              padding: '9px 12px',
              borderRadius: 8,
              background: 'rgba(31,26,21,0.05)',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Rubik', system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 500,
              color: '#4A4237',
              width: '100%',
              textAlign: 'right',
              direction: 'rtl',
            }}
          >
            סמן הכל כנקרא
          </button>
        )}
      </aside>

      {/* Main list */}
      <div>
        {/* Header strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1F1A15', letterSpacing: -0.3 }}>
              התראות
            </div>
            {unread > 0 && (
              <div
                style={{
                  background: '#C85A8A',
                  borderRadius: 99,
                  minWidth: 22,
                  height: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 8px',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, color: '#FFFFFF' }}>{unread}</span>
              </div>
            )}
          </div>
          <span style={{ fontSize: 12, color: '#8A8070' }}>{filtered.length} פריטים מוצגים</span>
        </div>

        {/* List */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(31,26,21,0.06)',
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                padding: '60px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <FiniAvatar size={54} mood="happy" />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1F1A15', marginBottom: 4 }}>אין התראות</div>
                <div style={{ fontSize: 13, color: '#8A8070' }}>הכל נראה מעולה</div>
              </div>
            </div>
          ) : (
            filtered.map((n, i) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  cursor: 'pointer',
                  borderBottom: i < filtered.length - 1 ? '1px solid rgba(31,26,21,0.05)' : 'none',
                  background: n.read ? '#FFFFFF' : 'rgba(200,90,138,0.03)',
                  borderRight: n.read ? 'none' : '3px solid #C85A8A',
                  transition: 'background 0.12s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#FAFAF5')}
                onMouseLeave={(e) => (e.currentTarget.style.background = n.read ? '#FFFFFF' : 'rgba(200,90,138,0.03)')}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 11,
                    background: n.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon name={n.icon} size={20} color={n.iconColor} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: n.read ? 500 : 700, color: '#1F1A15' }}>
                      {n.title}
                    </span>
                    <span style={{ fontSize: 11, color: '#8A8070', flexShrink: 0, marginRight: 12 }}>{n.time}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#4A4237', lineHeight: 1.5 }}>{n.body}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    dismiss(n.id)
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 4,
                    flexShrink: 0,
                    opacity: 0.5,
                    display: 'flex',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.5')}
                >
                  <Icon name="close" size={14} color="#4A4237" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
