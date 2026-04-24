'use client'
import React from 'react'
import { motion } from 'framer-motion'
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
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 240, delay: 0.1 }}
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
            <motion.button
              key={tab.name}
              onClick={() => onTab(tab.name)}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', damping: 18, stiffness: 300 }}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: '6px 16px',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                background: isActive ? tab.accent + '18' : 'transparent',
                minWidth: 72,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: 48,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-bar-active-pill"
                    transition={{ type: 'spring', damping: 24, stiffness: 320 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 999,
                      background: tab.accent,
                    }}
                  />
                )}
                <motion.div
                  animate={{ scale: isActive ? 1.05 : 1 }}
                  transition={{ type: 'spring', damping: 18, stiffness: 340 }}
                  style={{ position: 'relative', zIndex: 1, display: 'flex' }}
                >
                  <Icon
                    name={tab.icon}
                    size={20}
                    color={isActive ? '#FFFFFF' : '#8A8070'}
                  />
                </motion.div>
              </div>
              <motion.span
                animate={{
                  color: isActive ? '#1F1A15' : '#8A8070',
                  fontWeight: isActive ? 600 : 400,
                }}
                transition={{ duration: 0.2 }}
                style={{
                  fontFamily: "'Rubik', system-ui, sans-serif",
                  fontSize: 11,
                  lineHeight: 1,
                }}
              >
                {tab.label}
              </motion.span>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
