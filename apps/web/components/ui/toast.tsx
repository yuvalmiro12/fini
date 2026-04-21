'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastData {
  id: string
  message: string
  type: ToastType
}

const TONE: Record<ToastType, { bg: string; fg: string; icon: string }> = {
  success: { bg: '#5B8E6F', fg: '#FFFFFF', icon: '✓' },
  error:   { bg: '#D47070', fg: '#FFFFFF', icon: '!' },
  info:    { bg: '#1F1A15', fg: '#F7F5E8', icon: 'i' },
}

export function Toast({ toast, onDismiss }: { toast: ToastData | null; onDismiss: () => void }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={onDismiss}
          style={{
            position: 'absolute',
            top: 52,
            left: 16,
            right: 16,
            zIndex: 1000,
            background: TONE[toast.type].bg,
            color: TONE[toast.type].fg,
            borderRadius: 14,
            padding: '12px 16px',
            boxShadow: '0 8px 24px rgba(31,26,21,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            direction: 'rtl',
            fontFamily: "'Rubik', system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {TONE[toast.type].icon}
          </div>
          <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
