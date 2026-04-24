import React from 'react'
import { Icon } from './icon'

type TabName = 'chat' | 'insights' | 'data'

interface TabBarProps {
  active: TabName
  onTab: (tab: TabName) => void
}

const TABS: { name: TabName; label: string; icon: string; accent: string }[] = [
  { name: 'data', label: 'נתונים', icon: 'data', accent: '#5A6FB8' },
  { name: 'insights', label: 'תובנות', icon: 'insights', accent: '#5B8E6F' },
  { name: 'chat', label: 'צ\'אט', icon: 'chat', accent: '#C85A8A' },
]

export function TabBar({ active, onTab }: TabBarProps) {
  return (
    <div
      className="fini-mobile-tabbar"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 24,
        paddingTop: 16,
        background: 'linear-gradient(to top, rgba(247,245,232,1) 60%, rgba(247,245,232,0))',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          borderRadius: 999,
          padding: '6px 8px',
          boxShadow: '0 4px 24px rgba(31,26,21,0.1)',
        }}
      >
        {TABS.map((tab) => {
          const isActive = active === tab.name
          return (
            <button
              key={tab.name}
              onClick={() => onTab(tab.name)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: '6px 16px',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                background: isActive ? tab.accent + '18' : 'transparent',
                transition: 'all 0.2s ease',
                minWidth: 72,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 32,
                  borderRadius: 999,
                  background: isActive ? tab.accent : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon
                  name={tab.icon}
                  size={20}
                  color={isActive ? '#FFFFFF' : '#8A8070'}
                />
              </div>
              <span
                style={{
                  fontFamily: "'Rubik', system-ui, sans-serif",
                  fontSize: 11,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#1F1A15' : '#8A8070',
                  lineHeight: 1,
                }}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
