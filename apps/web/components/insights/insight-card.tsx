'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '../ui/icon'
import type {
  Insight,
  TrendInsight,
  BudgetInsight,
  AnomalyInsight,
  StreakInsight,
  MilestoneInsight,
} from '../../lib/insight-templates'

/**
 * InsightCard — a discriminated-union renderer for the 5 insight types.
 *
 * Shared across mobile (screens/insights.tsx) and desktop (desktop/insights.tsx):
 * the outer frame (entrance + exit animations, edit-mode wiggle + × delete button)
 * is the same everywhere; only the inner content changes per type.
 */

interface InsightCardProps {
  insight: Insight
  index: number
  editMode: boolean
  onDelete: () => void
  /** When true, desktop-style hover lift is applied; mobile passes false. */
  desktop?: boolean
  /** Background for the × button border — matches the screen background so it
   *  cleanly punches out of the card edge. */
  deleteBorderColor?: string
}

export function InsightCard({
  insight,
  index,
  editMode,
  onDelete,
  desktop = false,
  deleteBorderColor = '#D6EEE0',
}: InsightCardProps) {
  const hoverProps = desktop
    ? { whileHover: { y: -2, boxShadow: '0 8px 20px rgba(31,26,21,0.08)' } }
    : {}

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.18 } }}
      transition={{ delay: index * 0.04, type: 'spring', damping: 22, stiffness: 240 }}
      whileTap={!editMode ? { scale: 0.98 } : undefined}
      {...hoverProps}
      style={{
        background: desktop ? '#FFFFFF' : 'rgba(255,255,255,0.78)',
        border: desktop ? '1px solid rgba(31,26,21,0.06)' : 'none',
        borderRadius: desktop ? 14 : 16,
        padding: desktop ? 16 : 14,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        minHeight: insight.type === 'trend' || insight.type === 'budget' || insight.type === 'milestone' ? 92 : 84,
      }}
    >
      <AnimatePresence>
        {editMode && (
          <motion.button
            key="del"
            onClick={onDelete}
            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
            transition={{ type: 'spring', damping: 18, stiffness: 280 }}
            whileHover={desktop ? { scale: 1.1, rotate: 8 } : undefined}
            whileTap={{ scale: 0.88 }}
            style={{
              position: 'absolute',
              top: -6,
              left: -6,
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: '#D47070',
              color: '#FFFFFF',
              border: `2px solid ${deleteBorderColor}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              boxShadow: '0 2px 6px rgba(212,112,112,0.35)',
              zIndex: 3,
            }}
          >
            <Icon name="close" size={12} color="#FFFFFF" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        animate={editMode ? { rotate: [0, -0.8, 0.8, 0] } : { rotate: 0 }}
        transition={
          editMode
            ? { repeat: Infinity, duration: 0.5, ease: 'easeInOut', delay: index * 0.05 }
            : { duration: 0.2 }
        }
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        {/* Type-specific content */}
        {insight.type === 'trend' && <TrendContent insight={insight} index={index} />}
        {insight.type === 'budget' && <BudgetContent insight={insight} index={index} />}
        {insight.type === 'anomaly' && <AnomalyContent insight={insight} index={index} />}
        {insight.type === 'streak' && <StreakContent insight={insight} index={index} />}
        {insight.type === 'milestone' && <MilestoneContent insight={insight} index={index} />}
      </motion.div>
    </motion.div>
  )
}

// -- Shared pieces -----------------------------------------------------

function IconChip({ icon, tint, ink, size = 44 }: { icon: string; tint: string; ink: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        background: tint,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.5)} color={ink} />
    </div>
  )
}

function Header({
  insight,
  valuePill,
}: {
  insight: Insight
  valuePill?: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconChip icon={insight.icon} tint={insight.tint} ink={insight.ink} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 700, color: '#1F1A15', marginBottom: 2 }}>
          {insight.title}
        </div>
        <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, color: '#6C6456', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {insight.subtitle}
        </div>
      </div>
      {valuePill}
    </div>
  )
}

function ValuePill({ value, positive }: { value: string; positive: boolean }) {
  return (
    <div
      style={{
        fontFamily: "'Rubik', system-ui, sans-serif",
        fontSize: 13,
        fontWeight: 700,
        color: positive ? '#5B8E6F' : '#D47070',
        padding: '4px 10px',
        borderRadius: 99,
        background: positive ? '#DDEEDF' : '#FADEDC',
        whiteSpace: 'nowrap',
      }}
    >
      {value}
    </div>
  )
}

// -- TREND ------------------------------------------------------------

function TrendContent({ insight, index }: { insight: TrendInsight; index: number }) {
  return (
    <>
      <Header insight={insight} valuePill={<ValuePill value={insight.value} positive={insight.positive} />} />
      <Sparkline points={insight.sparkline} color={insight.ink} delay={0.15 + index * 0.04} />
    </>
  )
}

function Sparkline({ points, color, delay = 0 }: { points: number[]; color: string; delay?: number }) {
  const w = 260
  const h = 28
  const pad = 2
  const stepX = (w - pad * 2) / (points.length - 1)
  const path = points
    .map((p, i) => {
      const x = pad + i * stepX
      const y = pad + (1 - p) * (h - pad * 2)
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
  const last = points[points.length - 1]
  const lastX = pad + (points.length - 1) * stepX
  const lastY = pad + (1 - last) * (h - pad * 2)
  const areaPath = `${path} L ${w - pad} ${h} L ${pad} ${h} Z`

  return (
    <svg
      width="100%"
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={`sparkGrad-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={areaPath}
        fill={`url(#sparkGrad-${color.slice(1)})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.4, duration: 0.35 }}
      />
      <motion.path
        d={path}
        stroke={color}
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle
        cx={lastX}
        cy={lastY}
        r={2.5}
        fill={color}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 0.55, type: 'spring', damping: 12, stiffness: 300 }}
      />
    </svg>
  )
}

// -- BUDGET -----------------------------------------------------------

function BudgetContent({ insight, index }: { insight: BudgetInsight; index: number }) {
  const ratio = insight.used / insight.total
  const clamped = Math.min(ratio, 1.15)
  const over = ratio > 1
  const fillColor = over ? '#D47070' : insight.ink
  const pct = Math.round(ratio * 100)

  return (
    <>
      <Header
        insight={insight}
        valuePill={
          <ValuePill
            value={`${pct}%`}
            positive={!over && ratio < 0.9}
          />
        }
      />
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, color: '#4A4237', marginBottom: 6 }}>
          <span style={{ fontWeight: 600 }}>₪{insight.used.toLocaleString()}</span>
          <span style={{ color: '#8A8070' }}>מתוך ₪{insight.total.toLocaleString()}</span>
        </div>
        <div
          style={{
            background: 'rgba(31,26,21,0.08)',
            borderRadius: 99,
            height: 7,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${clamped * 100}%` }}
            transition={{ delay: 0.18 + index * 0.04, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              height: '100%',
              background: fillColor,
              borderRadius: 99,
            }}
          />
          {over && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              style={{
                position: 'absolute',
                right: '100%',
                top: '50%',
                transform: 'translate(50%, -50%)',
                width: 4,
                height: 16,
                background: '#1F1A15',
                borderRadius: 2,
              }}
            />
          )}
        </div>
      </div>
    </>
  )
}

// -- ANOMALY ----------------------------------------------------------

function AnomalyContent({ insight }: { insight: AnomalyInsight; index: number }) {
  return (
    <>
      <Header
        insight={insight}
        valuePill={
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.08, 1] }}
            transition={{ duration: 0.45, times: [0, 0.6, 1], ease: 'easeOut' }}
            style={{
              fontFamily: "'Rubik', system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: '#D47070',
              padding: '4px 10px',
              borderRadius: 99,
              background: '#FADEDC',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D47070' }} />
            {insight.value}
          </motion.div>
        }
      />
      <div
        style={{
          background: 'rgba(212,112,112,0.08)',
          border: '1px dashed rgba(212,112,112,0.3)',
          borderRadius: 10,
          padding: '8px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Icon name="sparkle" size={14} color="#D47070" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, fontWeight: 600, color: '#1F1A15', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {insight.txTitle}
          </div>
          <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 11, color: '#8A5050' }}>
            {insight.comparison}
          </div>
        </div>
      </div>
    </>
  )
}

// -- STREAK -----------------------------------------------------------

function StreakContent({ insight, index }: { insight: StreakInsight; index: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconChip icon={insight.icon} tint={insight.tint} ink={insight.ink} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 700, color: '#1F1A15', marginBottom: 2 }}>
          {insight.title}
        </div>
        <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, color: '#6C6456' }}>
          {insight.context}
        </div>
      </div>
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.12 + index * 0.04, type: 'spring', damping: 14, stiffness: 260 }}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 4,
          background: insight.tint,
          padding: '6px 12px',
          borderRadius: 14,
          border: `1.5px solid ${insight.ink}`,
        }}
      >
        <span
          style={{
            fontFamily: "'Rubik', system-ui, sans-serif",
            fontSize: 24,
            fontWeight: 800,
            color: insight.ink,
            lineHeight: 1,
            letterSpacing: -1,
          }}
        >
          {insight.count}
        </span>
        <span
          style={{
            fontFamily: "'Rubik', system-ui, sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: insight.ink,
          }}
        >
          {insight.unit}
        </span>
      </motion.div>
    </div>
  )
}

// -- MILESTONE --------------------------------------------------------

function MilestoneContent({ insight, index }: { insight: MilestoneInsight; index: number }) {
  const pct = Math.round(insight.progress * 100)
  const completed = insight.progress >= 1

  return (
    <>
      <Header
        insight={insight}
        valuePill={
          <motion.div
            initial={{ scale: 0.8, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.18 + index * 0.04, type: 'spring', damping: 12, stiffness: 220 }}
            style={{
              fontFamily: "'Rubik', system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: completed ? '#FFFFFF' : insight.ink,
              background: completed ? insight.ink : insight.tint,
              padding: '4px 12px',
              borderRadius: 99,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {completed && <Icon name="target" size={12} color="#FFFFFF" />}
            {pct}%
          </motion.div>
        }
      />
      <div>
        <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, fontWeight: 600, color: insight.ink, marginBottom: 6 }}>
          {insight.caption}
        </div>
        <div
          style={{
            background: 'rgba(31,26,21,0.08)',
            borderRadius: 99,
            height: 8,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: 0.2 + index * 0.04, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              height: '100%',
              background: completed
                ? `linear-gradient(90deg, ${insight.ink} 0%, ${insight.ink} 50%, #FFD88A 100%)`
                : insight.ink,
              borderRadius: 99,
            }}
          />
        </div>
      </div>
    </>
  )
}
