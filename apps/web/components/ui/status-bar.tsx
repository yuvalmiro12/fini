import React from 'react'

export function StatusBar() {
  return (
    <div
      style={{
        height: 54,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        direction: 'ltr',
        flexShrink: 0,
      }}
    >
      {/* Time */}
      <span
        style={{
          fontFamily: "'Rubik', system-ui, sans-serif",
          fontSize: 15,
          fontWeight: 600,
          color: '#1F1A15',
          letterSpacing: '-0.3px',
        }}
      >
        9:41
      </span>

      {/* Right icons: signal, wifi, battery */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="1" fill="#1F1A15" />
          <rect x="4.5" y="5" width="3" height="7" rx="1" fill="#1F1A15" />
          <rect x="9" y="2.5" width="3" height="9.5" rx="1" fill="#1F1A15" />
          <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#1F1A15" />
        </svg>

        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M1 4a9.5 9.5 0 0114 0" stroke="#1F1A15" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M3.5 7A6 6 0 0112.5 7" stroke="#1F1A15" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M6 9.5a3 3 0 014 0" stroke="#1F1A15" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <circle cx="8" cy="12" r="1" fill="#1F1A15" />
        </svg>

        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="#1F1A15" strokeWidth="1" />
          <rect x="2" y="2" width="16" height="8" rx="1.5" fill="#1F1A15" />
          <path d="M22.5 4v4a2 2 0 000-4z" fill="#1F1A15" opacity="0.4" />
        </svg>
      </div>
    </div>
  )
}
