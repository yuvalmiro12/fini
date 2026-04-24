'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, minWidth: 0 }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.h1
            key={title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 22, fontWeight: 700, color: '#1F1A15', letterSpacing: -0.5, margin: 0 }}
          >
            {title}
          </motion.h1>
        </AnimatePresence>
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
        {RANGES.map((r) => {
          const active = range === r
          return (
            <motion.button
              key={r}
              onClick={() => setRange(r)}
              whileTap={{ scale: 0.94 }}
              style={{
                position: 'relative',
                padding: '6px 12px',
                borderRadius: 7,
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Rubik', system-ui, sans-serif",
                fontSize: 12,
                fontWeight: active ? 600 : 500,
                color: active ? '#1F1A15' : '#8A8070',
                background: 'transparent',
              }}
            >
              {active && (
                <motion.span
                  layoutId="topbar-range-pill"
                  transition={{ type: 'spring', damping: 26, stiffness: 340 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#FFFFFF',
                    borderRadius: 7,
                    boxShadow: '0 1px 2px rgba(31,26,21,0.08)',
                    zIndex: 0,
                  }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1 }}>{r}</span>
            </motion.button>
          )
        })}
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
      <motion.button
        onClick={() => onNav('notifications')}
        aria-label="התראות"
        title="התראות"
        whileHover={{ background: 'rgba(255,255,255,0.95)', y: -1 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', damping: 18, stiffness: 320 }}
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
        <motion.span
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
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
      </motion.button>

      {/* Quick add */}
      <motion.button
        onClick={onAddTx}
        whileHover={{ y: -1, background: '#2a2218', boxShadow: '0 6px 16px rgba(31,26,21,0.2)' }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', damping: 18, stiffness: 300 }}
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
      </motion.button>
    </header>
  )
}
