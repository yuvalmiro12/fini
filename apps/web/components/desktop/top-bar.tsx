'use client'
import React, { useState } from 'react'
import { Icon } from '../ui/icon'

/**
 * TopBar — desktop-only header above the main pane.
 * Breadcrumb title (current screen) + search + date-range selector + quick add.
 * Height: 64px. No chrome at <1024px (whole DesktopShell is hidden there).
 */

const TITLES: Record<string, string> = {
  data: 'דשבורד',
  transactions: 'עסקאות',
  txDetail: 'פרטי עסקה',
  addTx: 'הוספת עסקה',
  insights: 'תובנות',
  savingsGoal: 'יעדי חיסכון',
  couples: 'תקציב משותף',
  settings: 'הגדרות',
  paywall: 'שדרוג',
  notifications: 'התראות',
}

const RANGES = ['החודש', '3 חודשים', 'שנה', 'הכל']

export function TopBar({
  screen,
  onNav,
  onAddTx,
}: {
  screen: string
  onNav: (s: string) => void
  onAddTx: () => void
}) {
  const [range, setRange] = useState('החודש')
  const [search, setSearch] = useState('')
  const title = TITLES[screen] || 'פיני'

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 28px',
        height: 64,
        background: '#F7F5E8',
        borderBottom: '1px solid rgba(31,26,21,0.06)',
        direction: 'rtl',
        fontFamily: "'Rubik', system-ui, sans-serif",
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1F1A15', letterSpacing: -0.5, margin: 0 }}>
          {title}
        </h1>
        <span style={{ fontSize: 13, color: '#8A8070' }}>
          {new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Date-range selector */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: 3,
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(31,26,21,0.06)',
          borderRadius: 10,
        }}
      >
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{
              padding: '6px 12px',
              borderRadius: 7,
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Rubik', system-ui, sans-serif",
              fontSize: 12,
              fontWeight: range === r ? 600 : 500,
              color: range === r ? '#1F1A15' : '#8A8070',
              background: range === r ? '#FFFFFF' : 'transparent',
              boxShadow: range === r ? '0 1px 2px rgba(31,26,21,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Search */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(31,26,21,0.06)',
          borderRadius: 10,
          width: 240,
        }}
      >
        <Icon name="search" size={16} color="#8A8070" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש..."
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontFamily: "'Rubik', system-ui, sans-serif",
            fontSize: 13,
            color: '#1F1A15',
            direction: 'rtl',
          }}
        />
      </div>

      {/* Notifications */}
      <button
        onClick={() => onNav('notifications')}
        aria-label="התראות"
        title="התראות"
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          border: '1px solid rgba(31,26,21,0.06)',
          background: 'rgba(255,255,255,0.7)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Icon name="bell" size={17} color="#4A4237" />
        <span
          style={{
            position: 'absolute',
            top: 8,
            right: 9,
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#C85A8A',
            border: '1.5px solid #F7F5E8',
          }}
        />
      </button>

      {/* Quick add */}
      <button
        onClick={onAddTx}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '9px 16px',
          borderRadius: 10,
          border: 'none',
          cursor: 'pointer',
          background: '#1F1A15',
          color: '#F7F5E8',
          fontFamily: "'Rubik', system-ui, sans-serif",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        <Icon name="plus" size={15} color="#F7F5E8" />
        עסקה חדשה
      </button>
    </header>
  )
}
