'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../ui/icon'

/**
 * Sidebar — desktop-only 240px right-edge navigation (RTL → grid-column 2 of 2).
 * Monarch-inspired: labeled items, brand at top, user card at bottom.
 * Each nav item: 40px tall, icon + label, accent wash when active.
 * Hidden at <1024px via `.fini-desktop-shell { display: none }` in globals.css.
 */

type Item = {
  key: string
  label: string
  icon: string
  accent: string
  matches: string[]
  target: string
}

const ITEMS: Item[] = [
  { key: 'data',     label: 'דשבורד',  icon: 'data',     accent: '#5A6FB8', matches: ['data'],                             target: 'data' },
  { key: 'tx',       label: 'עסקאות',  icon: 'receipt',  accent: '#4A4237', matches: ['transactions','txDetail','addTx'], target: 'transactions' },
  { key: 'insights', label: 'תובנות',  icon: 'trend',    accent: '#5B8E6F', matches: ['insights'],                        target: 'insights' },
  { key: 'goals',    label: 'יעדים',   icon: 'target',   accent: '#C9A24D', matches: ['savingsGoal'],                     target: 'savingsGoal' },
  { key: 'couples',  label: 'זוגות',   icon: 'users',    accent: '#C85A8A', matches: ['couples'],                         target: 'couples' },
]

const BOTTOM_ITEMS: Item[] = [
  { key: 'settings', label: 'הגדרות',    icon: 'settings', accent: '#8A8070', matches: ['settings','paywall'],   target: 'settings' },
  { key: 'notif',    label: 'התראות',    icon: 'bell',     accent: '#8A8070', matches: ['notifications'],        target: 'notifications' },
]

export function Sidebar({
  screen,
  onNav,
  userName,
  plan,
}: {
  screen: string
  onNav: (s: string) => void
  userName: string
  plan: 'free' | 'pro' | 'proplus'
}) {
  return (
    <aside
      className="fini-sidebar"
      style={{
        gridColumn: 1,
        gridRow: 1,
        width: 240,
        height: '100vh',
        position: 'sticky',
        top: 0,
        background: '#F2EEE0',
        borderLeft: '1px solid rgba(31,26,21,0.06)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 14px',
        direction: 'rtl',
        fontFamily: "'Rubik', system-ui, sans-serif",
      }}
    >
      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 6px 18px' }}
      >
        <motion.div
          whileHover={{ rotate: -8, scale: 1.05 }}
          transition={{ type: 'spring', damping: 16, stiffness: 300 }}
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: '#1F1A15',
            color: '#F7F5E8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: -0.3,
          }}
        >
          F
        </motion.div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1F1A15', letterSpacing: -0.3 }}>פיני</div>
          <div style={{ fontSize: 11, color: '#8A8070', fontWeight: 500 }}>ניהול פיננסי</div>
        </div>
      </motion.div>

      {/* Primary nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 6 }}>
        {ITEMS.map((item, i) => (
          <NavButton key={item.key} item={item} active={item.matches.includes(screen)} onClick={() => onNav(item.target)} index={i} />
        ))}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Secondary nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 12 }}>
        {BOTTOM_ITEMS.map((item, i) => (
          <NavButton key={item.key} item={item} active={item.matches.includes(screen)} onClick={() => onNav(item.target)} index={ITEMS.length + i} />
        ))}
      </nav>

      {/* User card */}
      <motion.div
        onClick={() => onNav('settings')}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        whileHover={{ background: 'rgba(255,255,255,0.95)', y: -1 }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 8px',
          borderRadius: 12,
          cursor: 'pointer',
          background: 'rgba(255,255,255,0.6)',
          border: '1px solid rgba(31,26,21,0.05)',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FDDDE8 0%, #C85A8A 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {userName.slice(0, 1)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1F1A15', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
          <div style={{ fontSize: 10, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.4 }}>
            {plan === 'free' ? 'חינם' : plan === 'pro' ? 'Pro' : 'Pro+'}
          </div>
        </div>
        <Icon name="chevron-left" size={14} color="#8A8070" />
      </motion.div>
    </aside>
  )
}

function NavButton({ item, active, onClick, index }: { item: Item; active: boolean; onClick: () => void; index: number }) {
  return (
    <motion.button
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08 + index * 0.04, duration: 0.22 }}
      whileHover={!active ? { background: 'rgba(255,255,255,0.6)', x: -2 } : undefined}
      whileTap={{ scale: 0.97 }}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 10,
        border: 'none',
        cursor: 'pointer',
        background: active ? '#FFFFFF' : 'transparent',
        color: active ? '#1F1A15' : '#4A4237',
        fontFamily: "'Rubik', system-ui, sans-serif",
        fontSize: 14,
        fontWeight: active ? 600 : 500,
        boxShadow: active ? '0 1px 2px rgba(31,26,21,0.04), 0 0 0 1px rgba(31,26,21,0.04)' : 'none',
        direction: 'rtl',
        textAlign: 'right',
        width: '100%',
      }}
    >
      {active && (
        <motion.span
          layoutId="sidebar-active-accent"
          transition={{ type: 'spring', damping: 26, stiffness: 340 }}
          style={{
            position: 'absolute',
            right: 0,
            top: 8,
            bottom: 8,
            width: 3,
            borderRadius: 3,
            background: item.accent,
          }}
        />
      )}
      <motion.span
        animate={{ scale: active ? 1.08 : 1 }}
        transition={{ type: 'spring', damping: 18, stiffness: 320 }}
        style={{ display: 'flex' }}
      >
        <Icon name={item.icon} size={18} color={active ? item.accent : '#8A8070'} />
      </motion.span>
      <span>{item.label}</span>
    </motion.button>
  )
}
