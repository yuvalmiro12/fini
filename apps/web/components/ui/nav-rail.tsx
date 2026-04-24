'use client'
import React from 'react'
import { Icon } from './icon'

/**
 * NavRail — desktop-only vertical sidebar (≥1024px).
 * Hidden on mobile via `.fini-nav-rail { display: none }` in globals.css,
 * so the mobile TabBar keeps owning navigation.
 *
 * Design note: chat is intentionally omitted here. On desktop the chat
 * pane is always visible on the right, so a "chat" nav button would be
 * redundant. Nav rail only drives the MAIN pane.
 */

type NavItem = {
  name: string
  label: string
  icon: string
  accent: string
  /** Which app-level screens this rail item should light up for. */
  matches: string[]
  /** The screen to navigate to when clicked. */
  target: string
}

const ITEMS: NavItem[] = [
  {
    name: 'data',
    label: 'נתונים',
    icon: 'data',
    accent: '#5A6FB8',
    matches: ['data', 'transactions', 'txDetail', 'addTx'],
    target: 'data',
  },
  {
    name: 'insights',
    label: 'תובנות',
    icon: 'insights',
    accent: '#5B8E6F',
    matches: ['insights', 'savingsGoal'],
    target: 'insights',
  },
  {
    name: 'settings',
    label: 'הגדרות',
    icon: 'settings',
    accent: '#8A8070',
    matches: ['settings', 'paywall', 'couples', 'notifications'],
    target: 'settings',
  },
]

export function NavRail({
  screen,
  onNav,
}: {
  screen: string
  onNav: (screen: string) => void
}) {
  return (
    <aside className="fini-nav-rail">
      {/* Brand dot at top */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: '#1F1A15',
          color: '#F7F5E8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Rubik', system-ui, sans-serif",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: -0.3,
          marginBottom: 16,
        }}
      >
        F
      </div>

      {ITEMS.map((item) => {
        const isActive = item.matches.includes(screen)
        return (
          <button
            key={item.name}
            onClick={() => onNav(item.target)}
            title={item.label}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              background: isActive ? item.accent : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.18s ease',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(31,26,21,0.06)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            <Icon
              name={item.icon}
              size={22}
              color={isActive ? '#FFFFFF' : '#8A8070'}
            />
          </button>
        )
      })}
    </aside>
  )
}
