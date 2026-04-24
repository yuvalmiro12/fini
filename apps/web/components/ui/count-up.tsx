'use client'
import React from 'react'
import { animate, useMotionValue, useTransform, motion } from 'framer-motion'

/**
 * CountUp — animates a number from 0 → value on mount.
 * Uses framer-motion's `animate()` driver to update a MotionValue over time.
 *
 * Props:
 *   value       — target number
 *   duration    — seconds (default 1.1)
 *   delay       — seconds before the animation begins (default 0)
 *   prefix      — rendered before the number, e.g. "₪"
 *   suffix      — rendered after the number, e.g. "%"
 *   format      — custom formatter (default: integer with thousand separators)
 */
export function CountUp({
  value,
  duration = 1.1,
  delay = 0,
  prefix = '',
  suffix = '',
  format,
  style,
}: {
  value: number
  duration?: number
  delay?: number
  prefix?: string
  suffix?: string
  format?: (n: number) => string
  style?: React.CSSProperties
}) {
  const mv = useMotionValue(0)
  const fmt = format ?? ((n: number) => Math.round(n).toLocaleString())
  const display = useTransform(mv, (v) => `${prefix}${fmt(v)}${suffix}`)

  React.useEffect(() => {
    const controls = animate(mv, value, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
    })
    return controls.stop
  }, [mv, value, duration, delay])

  return <motion.span style={style}>{display}</motion.span>
}
