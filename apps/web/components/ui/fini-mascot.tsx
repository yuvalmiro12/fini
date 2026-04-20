import React from 'react'

type Mood = 'happy' | 'wink' | 'talk' | 'wave'

interface FiniMascotProps {
  size?: number
  mood?: Mood
}

export function FiniMascot({ size = 96, mood = 'happy' }: FiniMascotProps) {
  const scale = size / 120
  const cx = 60
  const cy = 58
  const r = 44

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="finiBody" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#F7D98A" />
          <stop offset="55%" stopColor="#E8B862" />
          <stop offset="100%" stopColor="#C9A24D" />
        </radialGradient>
        <radialGradient id="finiCheek" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F9C6D7" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FDDDE8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="finiShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C9A24D" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#C9A24D" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="60" cy="108" rx="28" ry="7" fill="url(#finiShadow)" />

      {/* Body */}
      <circle cx={cx} cy={cy} r={r} fill="url(#finiBody)" />

      {/* Inner coin ring dashed */}
      <circle
        cx={cx}
        cy={cy}
        r={r - 6}
        stroke="#C9A24D"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        fill="none"
        opacity="0.4"
      />

      {/* Cheeks */}
      <ellipse cx="40" cy="66" rx="8" ry="5" fill="url(#finiCheek)" />
      <ellipse cx="80" cy="66" rx="8" ry="5" fill="url(#finiCheek)" />

      {/* Left eye */}
      {mood === 'wink' ? (
        <path d="M46 54 Q50 50 54 54" stroke="#1F1A15" strokeWidth="2" strokeLinecap="round" fill="none" />
      ) : (
        <circle cx="50" cy="54" r="3.5" fill="#1F1A15" />
      )}

      {/* Right eye */}
      <circle cx="70" cy="54" r="3.5" fill="#1F1A15" />

      {/* Mouth */}
      {mood === 'talk' ? (
        <ellipse cx="60" cy="69" rx="7" ry="5" fill="#1F1A15" opacity="0.85" />
      ) : (
        <path d="M52 66 Q60 74 68 66" stroke="#1F1A15" strokeWidth="2" strokeLinecap="round" fill="none" />
      )}

      {/* Sparkle antenna */}
      <line x1="60" y1="14" x2="60" y2="8" stroke="#C9A24D" strokeWidth="2" />
      <circle cx="60" cy="7" r="3" fill="#F7D98A" stroke="#C9A24D" strokeWidth="1.5" />
      <line x1="56" y1="4" x2="54" y2="2" stroke="#C9A24D" strokeWidth="1.5" />
      <line x1="64" y1="4" x2="66" y2="2" stroke="#C9A24D" strokeWidth="1.5" />

      {/* Wave hand */}
      {mood === 'wave' && (
        <g>
          <ellipse cx="100" cy="52" rx="8" ry="10" fill="url(#finiBody)" transform="rotate(20, 100, 52)" />
          <path d="M95 45 Q100 38 105 42" stroke="#C9A24D" strokeWidth="1.2" fill="none" opacity="0.6" />
        </g>
      )}
    </svg>
  )
}

interface FiniAvatarProps {
  size?: number
  mood?: Mood
}

export function FiniAvatar({ size = 36, mood = 'happy' }: FiniAvatarProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 35%, #F7D98A, #E8B862 55%, #C9A24D)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <svg width={size * 0.85} height={size * 0.85} viewBox="0 0 36 36" fill="none">
        {/* Eyes */}
        {mood === 'wink' ? (
          <path d="M12 16 Q14.5 13.5 17 16" stroke="#1F1A15" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        ) : (
          <circle cx="14" cy="16" r="2" fill="#1F1A15" />
        )}
        <circle cx="22" cy="16" r="2" fill="#1F1A15" />

        {/* Mouth */}
        {mood === 'talk' ? (
          <ellipse cx="18" cy="22" rx="4" ry="3" fill="#1F1A15" opacity="0.85" />
        ) : (
          <path d="M13 21 Q18 26 23 21" stroke="#1F1A15" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        )}

        {/* Cheeks */}
        <ellipse cx="10" cy="20" rx="3" ry="2" fill="#F9C6D7" opacity="0.7" />
        <ellipse cx="26" cy="20" rx="3" ry="2" fill="#F9C6D7" opacity="0.7" />

        {/* Sparkle */}
        <circle cx="18" cy="5" r="1.5" fill="#C9A24D" />
        <line x1="18" y1="7" x2="18" y2="10" stroke="#C9A24D" strokeWidth="1.2" />
      </svg>
    </div>
  )
}
