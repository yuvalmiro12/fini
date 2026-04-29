import React from 'react'

interface IconProps {
  name: string
  size?: number
  color?: string
  style?: React.CSSProperties
}

export function Icon({ name, size = 24, color = '#1F1A15', style }: IconProps) {
  const strokeProps = {
    stroke: color,
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  }

  const renderPath = () => {
    switch (name) {
      case 'chat':
        return <path {...strokeProps} d="M5 10c0-3 2.5-5 7-5s7 2 7 5-2.5 5-7 5c-1 0-2-.1-2.8-.3L5 17l.8-3.2C5.3 12.9 5 11.5 5 10z" />
      case 'insights':
        return <path {...strokeProps} d="M5 19V9M12 19V5M19 19v-7" />
      case 'data':
        return (
          <>
            <rect {...strokeProps} x="4" y="4" width="7" height="7" rx="1.5" />
            <rect {...strokeProps} x="13" y="4" width="7" height="4" rx="1.5" />
            <rect {...strokeProps} x="13" y="10" width="7" height="10" rx="1.5" />
            <rect {...strokeProps} x="4" y="13" width="7" height="7" rx="1.5" />
          </>
        )
      case 'add':
        return (
          <>
            <circle {...strokeProps} cx="12" cy="12" r="8" />
            <path {...strokeProps} d="M12 8v8M8 12h8" />
          </>
        )
      case 'camera':
        return (
          <>
            <path {...strokeProps} d="M4 8h3l2-2h6l2 2h3v10H4z" />
            <circle {...strokeProps} cx="12" cy="13" r="3" />
          </>
        )
      case 'mic':
        return (
          <>
            <rect {...strokeProps} x="9.5" y="4" width="5" height="10" rx="2.5" />
            <path {...strokeProps} d="M6 11a6 6 0 0012 0M12 17v3" />
          </>
        )
      case 'plus':
        return <path {...strokeProps} d="M12 5v14M5 12h14" />
      case 'arrow':
        return <path {...strokeProps} d="M5 12h14M13 6l6 6-6 6" />
      case 'arrowL':
        return <path {...strokeProps} d="M19 12H5M11 6l-6 6 6 6" />
      case 'send':
        return <path {...strokeProps} d="M20 4L4 11l7 2 2 7z" />
      case 'upload':
        return (
          <>
            <path {...strokeProps} d="M12 15V3M8 7l4-4 4 4" />
            <path {...strokeProps} d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </>
        )
      case 'filter':
        return <path {...strokeProps} d="M4 5h16M7 12h10M10 19h4" />
      case 'search':
        return (
          <>
            <circle {...strokeProps} cx="11" cy="11" r="6" />
            <path {...strokeProps} d="M20 20l-4.5-4.5" />
          </>
        )
      case 'settings':
        return (
          <>
            <circle {...strokeProps} cx="12" cy="12" r="3" />
            <path {...strokeProps} d="M19.4 14a7.7 7.7 0 000-4l2-1.5-2-3.4-2.4.8a7.7 7.7 0 00-3.5-2L13 1h-4l-.5 2.9a7.7 7.7 0 00-3.5 2l-2.4-.8-2 3.4L2.6 10a7.7 7.7 0 000 4l-2 1.5 2 3.4 2.4-.8a7.7 7.7 0 003.5 2L9 23h4l.5-2.9a7.7 7.7 0 003.5-2l2.4.8 2-3.4z" />
          </>
        )
      case 'bell':
        return (
          <>
            <path {...strokeProps} d="M6 15V10a6 6 0 0112 0v5l1.5 2H4.5z" />
            <path {...strokeProps} d="M10 19a2 2 0 004 0" />
          </>
        )
      case 'wallet':
        return (
          <>
            <rect {...strokeProps} x="3" y="6" width="18" height="13" rx="2.5" />
            <path {...strokeProps} d="M3 10h18M16 14.5h2" />
          </>
        )
      case 'target':
        return (
          <>
            <circle {...strokeProps} cx="12" cy="12" r="8" />
            <circle {...strokeProps} cx="12" cy="12" r="4" />
            <circle cx="12" cy="12" r="1" fill={color} />
          </>
        )
      case 'sparkle':
        return <path {...strokeProps} d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />
      case 'receipt':
        return <path {...strokeProps} d="M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21zM9 8h6M9 12h6M9 16h4" />
      case 'heart':
        return <path {...strokeProps} d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" />
      case 'home':
        return <path {...strokeProps} d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1z" />
      case 'coffee':
        return (
          <>
            <path {...strokeProps} d="M5 9h13v6a4 4 0 01-4 4H9a4 4 0 01-4-4z" />
            <path {...strokeProps} d="M18 10h2a2 2 0 010 4h-2M8 4v2M12 4v2" />
          </>
        )
      case 'cart':
        return <path {...strokeProps} d="M3 4h2l2.5 11h11L21 8H6M9 20a1 1 0 100-2 1 1 0 000 2zM18 20a1 1 0 100-2 1 1 0 000 2z" />
      case 'car':
        return (
          <>
            <path {...strokeProps} d="M5 14l1.5-5h11L19 14M3 14h18v4h-2v-1H5v1H3z" />
            <path {...strokeProps} d="M7 18a1 1 0 100-2 1 1 0 000 2zM17 18a1 1 0 100-2 1 1 0 000 2z" />
          </>
        )
      case 'bolt':
        return <path {...strokeProps} d="M13 3L5 14h6l-1 7 8-11h-6z" />
      case 'gift':
        return (
          <>
            <rect {...strokeProps} x="3" y="9" width="18" height="11" rx="1" />
            <path {...strokeProps} d="M3 13h18M12 9v11M8 9a2.5 2.5 0 010-5c2 0 4 2.5 4 5M16 9a2.5 2.5 0 000-5c-2 0-4 2.5-4 5" />
          </>
        )
      case 'phone':
        return (
          <>
            <rect {...strokeProps} x="7" y="3" width="10" height="18" rx="2" />
            <path {...strokeProps} d="M11 18h2" />
          </>
        )
      case 'lock':
        return (
          <>
            <rect {...strokeProps} x="5" y="10" width="14" height="10" rx="2" />
            <path {...strokeProps} d="M8 10V7a4 4 0 018 0v3" />
          </>
        )
      case 'check':
        return <path {...strokeProps} d="M5 12l4 4 10-10" />
      case 'close':
        return <path {...strokeProps} d="M6 6l12 12M18 6L6 18" />
      case 'chevron-down':
        return <path {...strokeProps} d="M6 9l6 6 6-6" />
      case 'chevron-up':
        return <path {...strokeProps} d="M6 15l6-6 6 6" />
      case 'chevron-right':
        return <path {...strokeProps} d="M9 6l6 6-6 6" />
      case 'chevron-left':
        return <path {...strokeProps} d="M15 6l-6 6 6 6" />
      case 'dots':
        return (
          <>
            <circle cx="6" cy="12" r="1.5" fill={color} />
            <circle cx="12" cy="12" r="1.5" fill={color} />
            <circle cx="18" cy="12" r="1.5" fill={color} />
          </>
        )
      case 'calendar':
        return (
          <>
            <rect {...strokeProps} x="4" y="5" width="16" height="15" rx="2" />
            <path {...strokeProps} d="M4 10h16M8 3v4M16 3v4" />
          </>
        )
      case 'trend':
        return (
          <>
            <path {...strokeProps} d="M3 17l5-5 4 4 7-9" />
            <path {...strokeProps} d="M16 7h4v4" />
          </>
        )
      case 'piggy':
        return (
          <>
            <path {...strokeProps} d="M5 13c0-3.5 3-6 7-6 1 0 2 .1 3 .4L17 6l1 2c1.5 1 2 2.5 2 4 0 2-1 3.5-2.5 4.5L17 20h-3l-.5-1.5h-3L10 20H7l-1-3C5.5 16.3 5 14.8 5 13z" />
            <circle cx="9" cy="12" r=".8" fill={color} />
            <path {...strokeProps} d="M14 10h2" />
          </>
        )
      case 'users':
        return (
          <>
            <circle {...strokeProps} cx="9" cy="8" r="3.5" />
            <path {...strokeProps} d="M3 20v-1a5 5 0 015-5h2a5 5 0 015 5v1" />
            <circle {...strokeProps} cx="17" cy="9" r="2.5" />
            <path {...strokeProps} d="M15 14h1a5 5 0 015 5v1" />
          </>
        )
      case 'globe':
        return (
          <>
            <circle {...strokeProps} cx="12" cy="12" r="8" />
            <path {...strokeProps} d="M4 12h16M12 4a12 12 0 010 16M12 4a12 12 0 000 16" />
          </>
        )
      case 'tag':
        return (
          <>
            <path {...strokeProps} d="M3 12V4h8l10 10-8 8z" />
            <circle {...strokeProps} cx="8" cy="8" r="1.5" />
          </>
        )
      case 'apple':
        return (
          <path
            fill={color}
            d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.54 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
          />
        )
      case 'google':
        return (
          <>
            <path fill="#4285F4" d="M21.8 12.2c0-.7-.06-1.4-.17-2.07H12v3.91h5.5a4.7 4.7 0 01-2.04 3.08v2.56h3.3c1.93-1.78 3.04-4.4 3.04-7.48z" />
            <path fill="#34A853" d="M12 22c2.76 0 5.08-.92 6.77-2.48l-3.3-2.56c-.92.62-2.1.98-3.47.98-2.66 0-4.92-1.8-5.73-4.22H2.88v2.64A10 10 0 0012 22z" />
            <path fill="#FBBC05" d="M6.27 13.72A6.02 6.02 0 016 12c0-.6.09-1.17.27-1.72V7.64H2.88A10 10 0 002 12c0 1.62.39 3.14 1.08 4.48l3.19-2.76z" />
            <path fill="#EA4335" d="M12 5.78c1.5 0 2.84.52 3.9 1.52l2.92-2.92C17.07 2.8 14.76 2 12 2A10 10 0 002.88 7.64l3.39 2.64C7.08 7.58 9.34 5.78 12 5.78z" />
          </>
        )
      default:
        return <circle {...strokeProps} cx="12" cy="12" r="8" />
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      {renderPath()}
    </svg>
  )
}
