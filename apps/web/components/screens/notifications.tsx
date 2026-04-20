'use client'
import React, { useState } from 'react'
import { FiniAvatar } from '../ui/fini-mascot'
import { Icon } from '../ui/icon'
import { StatusBar } from '../ui/status-bar'

interface NotificationsProps {
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
  { id: 'n1', icon: 'bolt',    iconBg: '#F3E7C7', iconColor: '#C9A24D', title: 'חיוב גבוה זוהה',       body: 'חשמל ומים — ₪340, גבוה ב-23% מהחודש שעבר.',     time: 'לפני שעה',   read: false },
  { id: 'n2', icon: 'target',  iconBg: '#D6EEE0', iconColor: '#5B8E6F', title: 'יעד חיסכון — 56%',     body: 'כל הכבוד! צעד אחד נוסף ואת שם.',                  time: 'לפני 3 שעות', read: false },
  { id: 'n3', icon: 'sparkle', iconBg: '#FDDDE8', iconColor: '#C85A8A', title: 'תובנה חדשה מפיני',     body: 'הוצאות האוכל שלך ירדו ב-8% — סו טוב!',            time: 'אתמול',       read: false },
  { id: 'n4', icon: 'cart',    iconBg: '#FADEDC', iconColor: '#D47070', title: 'חרגת מתקציב קניות',   body: 'הוצאת ₪450 על קניות — מעל התקציב החודשי שלך.',    time: 'אתמול',       read: true  },
  { id: 'n5', icon: 'users',   iconBg: '#E8ECFF', iconColor: '#5A6FB8', title: 'תקציב משותף עודכן',   body: 'יונתן הוסיף הוצאה: ארנונה ₪780.',                  time: 'לפני 3 ימים', read: true  },
  { id: 'n6', icon: 'trend',   iconBg: '#D6EEE0', iconColor: '#5B8E6F', title: 'סיכום שבועי מוכן',   body: 'הוצאות השבוע: ₪816. לחץ לצפייה בפירוט.',          time: 'לפני 5 ימים', read: true  },
]

export function NotificationsScreen({ nav, prevScreen = 'insights' }: NotificationsProps) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  const unread = notifications.filter(n => !n.read).length

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const dismiss = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id))

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F7F5E8', direction: 'rtl', overflow: 'hidden' }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '4px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => nav(prevScreen)}
          style={{ background: 'rgba(31,26,21,0.06)', border: 'none', borderRadius: 12, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#1F1A15' }}
        >
          <Icon name="arrowL" size={16} color="#1F1A15" />
          חזור
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 18, fontWeight: 700, color: '#1F1A15' }}>התראות</span>
          {unread > 0 && (
            <div style={{ background: '#C85A8A', borderRadius: 99, minWidth: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
              <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 11, fontWeight: 700, color: '#FFFFFF' }}>{unread}</span>
            </div>
          )}
        </div>
        {unread > 0 ? (
          <button onClick={markAllRead} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#5A6FB8', fontWeight: 500 }}>
            סמן הכל כנקרא
          </button>
        ) : (
          <div style={{ width: 60 }} />
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 40px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {notifications.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, paddingTop: 60 }}>
            <FiniAvatar size={60} mood="happy" />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 18, fontWeight: 700, color: '#1F1A15', marginBottom: 6 }}>אין התראות</div>
              <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, color: '#8A8070' }}>הכל נראה מעולה!</div>
            </div>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              style={{ background: n.read ? 'rgba(255,255,255,0.6)' : '#FFFFFF', borderRadius: 16, padding: '14px 14px 14px 10px', display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', boxShadow: n.read ? 'none' : '0 2px 12px rgba(31,26,21,0.08)', position: 'relative', borderRight: n.read ? 'none' : '3px solid #C85A8A' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: n.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={n.icon} size={20} color={n.iconColor} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: n.read ? 500 : 700, color: '#1F1A15' }}>{n.title}</span>
                  <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 11, color: '#8A8070', flexShrink: 0, marginRight: 8 }}>{n.time}</span>
                </div>
                <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#4A4237', lineHeight: 1.4 }}>{n.body}</div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); dismiss(n.id) }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 0 0 0', flexShrink: 0, opacity: 0.4 }}
              >
                <Icon name="close" size={14} color="#4A4237" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
