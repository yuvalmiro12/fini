import React from 'react'
import { CATS } from '../../lib/cats'
import { Icon } from './icon'

interface CatIconProps {
  cat: string
  size?: number
  radius?: number
}

export function CatIcon({ cat, size = 40, radius = 12 }: CatIconProps) {
  const def = CATS[cat] || CATS.other
  const iconSize = Math.round(size * 0.5)

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: def.tint,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon name={def.icon} size={iconSize} color={def.ink} />
    </div>
  )
}
