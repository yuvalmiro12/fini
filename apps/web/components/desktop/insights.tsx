'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '../ui/icon'
import { FiniAvatar } from '../ui/fini-mascot'
import { AddInsightModal } from './add-insight-modal'
import { DEFAULT_INSIGHTS, type Insight } from '../../lib/insight-templates'
import type { SavingsGoal, Transaction } from '../../lib/seed'

/**
 * InsightsDesktop — multi-card analysis layout.
 * Left: savings hero + editable insight cards grid.
 * Right: month-over-month comparison + fini-tip.
 *
 * v1.4 — insights are now stateful:
 *   • "+ הוסף תובנה" opens AddInsightModal (templates / AI prompt).
 *   • "ערוך" toggles edit mode → delete × on each card.
 *   • All card mounts/unmounts animated via framer-motion (stagger + exit).
 *   • Savings progress bar animates from 0 on mount.
 *   • Monthly comparison bars stagger-fill.
 */

interface Props {
  nav: (screen: string) => void
  savingsGoal: SavingsGoal
  transactions: Transaction[]
}

const MONTHS = [
  { label: 'ינו', expense: 3200 },
  { label: 'פבר', expense: 4100 },
  { label: 'מרץ', expense: 3600 },
  { label: 'אפר', expense: 3052 },
]

export function InsightsDesktop({ nav, savingsGoal }: Props) {
  const pct = Math.round((savingsGoal.current / savingsGoal.target) * 100)
  const maxMonth = Math.max(...MONTHS.map((m) => m.expense))

  const [insights, setInsights] = useState<Insight[]>(DEFAULT_INSIGHTS)
  const [editMode, setEditMode] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const handleAdd = (ins: Insight) => {
    setInsights((prev) => [...prev, ins])
  }

  const handleRemove = (id: string) => {
    setInsights((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <div
      style={{
        padding: '24px 28px 80px',
        maxWidth: 1280,
        margin: '0 auto',
        direction: 'rtl',
        fontFamily: "'Rubik', system-ui, sans-serif",
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 18,
      }}
    >
      {/* Left column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Savings hero */}
        <motion.div
          onClick={() => nav('savingsGoal')}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -2 }}
          style={{
            background: 'linear-gradient(135deg, #5B8E6F 0%, #3D6B53 100%)',
            borderRadius: 16,
            padding: 24,
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            color: '#FFFFFF',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -40,
              left: -40,
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Icon name="target" size={18} color="rgba(255,255,255,0.85)" />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.3 }}>
                  יעד חיסכון פעיל
                </span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 4, letterSpacing: -0.5 }}>
                {savingsGoal.title}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>
                עד {savingsGoal.deadline}
              </div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, type: 'spring', damping: 18, stiffness: 200 }}
                style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}
              >
                {pct}%
              </motion.div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>הושלם</div>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 99, height: 10, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${pct}%` }}
              transition={{ delay: 0.15, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: '100%',
                background: '#BEE3CB',
                borderRadius: 99,
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
            <span>₪{savingsGoal.current.toLocaleString()} נצבר</span>
            <span>עוד ₪{(savingsGoal.target - savingsGoal.current).toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Insights header */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingInline: 2 }}
        >
          <div>
            <div style={{ fontSize: 11, color: '#8A8070', fontWeight: 500, letterSpacing: 0.3, textTransform: 'uppercase' }}>
              תובנות חכמות
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1F1A15', letterSpacing: -0.3, marginTop: 2 }}>
              התובנות שלך
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <motion.button
              onClick={() => setEditMode((v) => !v)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '8px 14px',
                borderRadius: 99,
                border: '1px solid rgba(31,26,21,0.1)',
                background: editMode ? '#1F1A15' : '#FFFFFF',
                color: editMode ? '#F7F5E8' : '#4A4237',
                cursor: 'pointer',
                fontFamily: "'Rubik', system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'background 0.2s ease, color 0.2s ease',
              }}
            >
              <Icon name="settings" size={13} color={editMode ? '#F7F5E8' : '#4A4237'} />
              {editMode ? 'סיום' : 'ערוך'}
            </motion.button>
            <motion.button
              onClick={() => setModalOpen(true)}
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '8px 14px',
                borderRadius: 99,
                border: 'none',
                background: '#C85A8A',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontFamily: "'Rubik', system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 12px rgba(200,90,138,0.25)',
              }}
            >
              <Icon name="plus" size={13} color="#FFFFFF" />
              הוסף תובנה
            </motion.button>
          </div>
        </motion.div>

        {/* Insight cards grid */}
        <motion.div
          layout
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}
        >
          <AnimatePresence mode="popLayout">
            {insights.map((row, i) => (
              <motion.div
                key={row.id}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.18 } }}
                transition={{ delay: i * 0.04, type: 'spring', damping: 22, stiffness: 240 }}
                whileHover={{ y: -2, boxShadow: '0 8px 20px rgba(31,26,21,0.08)' }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(31,26,21,0.06)',
                  borderRadius: 12,
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  position: 'relative',
                }}
              >
                {/* Delete button (edit mode only) */}
                <AnimatePresence>
                  {editMode && (
                    <motion.button
                      key="del"
                      onClick={() => handleRemove(row.id)}
                      initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                      transition={{ type: 'spring', damping: 18, stiffness: 280 }}
                      whileHover={{ scale: 1.1, rotate: 8 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        position: 'absolute',
                        top: -8,
                        left: -8,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: '#D47070',
                        color: '#FFFFFF',
                        border: '2px solid #FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        boxShadow: '0 2px 6px rgba(212,112,112,0.35)',
                        zIndex: 2,
                      }}
                    >
                      <Icon name="close" size={12} color="#FFFFFF" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Edit-mode wiggle wrapper */}
                <motion.div
                  animate={editMode ? { rotate: [0, -0.8, 0.8, 0] } : { rotate: 0 }}
                  transition={
                    editMode
                      ? { repeat: Infinity, duration: 0.5, ease: 'easeInOut', delay: i * 0.05 }
                      : { duration: 0.2 }
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 11,
                      background: row.tint,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={row.icon} size={22} color={row.ink} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1F1A15', marginBottom: 2 }}>{row.title}</div>
                    <div style={{ fontSize: 12, color: '#4A4237', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {row.subtitle}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: row.positive ? '#5B8E6F' : '#D47070',
                      padding: '4px 10px',
                      borderRadius: 99,
                      background: row.positive ? '#DDEEDF' : '#FADEDC',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.value}
                  </div>
                </motion.div>
              </motion.div>
            ))}

            {/* Empty state / add tile */}
            {insights.length === 0 && (
              <motion.button
                key="empty"
                onClick={() => setModalOpen(true)}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.01, borderColor: '#C85A8A' }}
                style={{
                  gridColumn: '1 / -1',
                  background: 'rgba(255,255,255,0.5)',
                  border: '2px dashed rgba(31,26,21,0.18)',
                  borderRadius: 12,
                  padding: '28px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: "'Rubik', system-ui, sans-serif",
                }}
              >
                <Icon name="sparkle" size={22} color="#C85A8A" />
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1F1A15' }}>עדיין אין תובנות</div>
                <div style={{ fontSize: 12, color: '#8A8070' }}>לחץ כאן כדי להוסיף תובנה ראשונה</div>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Right column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Monthly comparison */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(31,26,21,0.06)',
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div style={{ fontSize: 11, color: '#8A8070', fontWeight: 500, marginBottom: 4 }}>השוואה חודשית</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1F1A15', letterSpacing: -0.5, marginBottom: 16 }}>
            הוצאות לפי חודש
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {MONTHS.map((m, i) => {
              const w = (m.expense / maxMonth) * 100
              const isLatest = i === MONTHS.length - 1
              return (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#8A8070', fontWeight: 500 }}>{m.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: isLatest ? '#5A6FB8' : '#4A4237' }}>
                      ₪{m.expense.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ background: 'rgba(31,26,21,0.06)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: `${w}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        height: '100%',
                        background: isLatest ? '#5A6FB8' : 'rgba(90,111,184,0.4)',
                        borderRadius: 99,
                      }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Fini tip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          style={{
            background: 'linear-gradient(135deg, #FDDDE8 0%, #F9C6D7 100%)',
            borderRadius: 14,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FiniAvatar size={36} mood="happy" />
            <div style={{ fontSize: 13, fontWeight: 700, color: '#C85A8A', letterSpacing: 0.3 }}>טיפ מפיני</div>
          </div>
          <div style={{ fontSize: 14, color: '#1F1A15', lineHeight: 1.5 }}>
            בקצב הנוכחי תגיעי ליעד {savingsGoal.title} עוד כ־3 חודשים. העברה של ₪500 נוספים בחודש תקצר את הזמן לחצי!
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => nav('savingsGoal')}
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              background: '#C85A8A',
              color: '#FFFFFF',
              fontFamily: "'Rubik', system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              alignSelf: 'flex-start',
            }}
          >
            לעריכת היעד
          </motion.button>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.35 }}
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(31,26,21,0.06)',
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1F1A15', marginBottom: 12 }}>פעולות מהירות</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <motion.button
              whileHover={{ x: -2, background: '#F3EEDF' }}
              onClick={() => nav('transactions')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid rgba(31,26,21,0.08)',
                background: '#FAFAF5',
                cursor: 'pointer',
                fontFamily: "'Rubik', system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 500,
                color: '#1F1A15',
                direction: 'rtl',
              }}
            >
              <Icon name="receipt" size={16} color="#5A6FB8" />
              עיין בעסקאות
            </motion.button>
            <motion.button
              whileHover={{ x: -2, background: '#F3EEDF' }}
              onClick={() => nav('couples')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid rgba(31,26,21,0.08)',
                background: '#FAFAF5',
                cursor: 'pointer',
                fontFamily: "'Rubik', system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 500,
                color: '#1F1A15',
                direction: 'rtl',
              }}
            >
              <Icon name="users" size={16} color="#C85A8A" />
              תקציב משותף
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Add insight modal */}
      <AddInsightModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
        existingIds={insights.map((i) => i.id)}
      />
    </div>
  )
}
