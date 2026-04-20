import React from 'react';
import Svg, { Path, Circle, Rect, G, Line, Polyline, Polygon } from 'react-native-svg';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

const STROKE_PROPS = {
  strokeWidth: '1.6',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
};

export default function Icon({ name, size = 24, color = '#1F1A15' }: IconProps) {
  const s = { stroke: color, ...STROKE_PROPS };

  const icons: Record<string, React.ReactNode> = {
    data: (
      <>
        <Path d="M3 3v18h18" {...s} />
        <Path d="M7 16l4-4 4 4 4-7" {...s} />
      </>
    ),
    insights: (
      <>
        <Circle cx="12" cy="12" r="9" {...s} />
        <Path d="M12 8v4l3 3" {...s} />
      </>
    ),
    chat: (
      <>
        <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" {...s} />
      </>
    ),
    add: (
      <>
        <Circle cx="12" cy="12" r="9" {...s} />
        <Path d="M12 8v8M8 12h8" {...s} />
      </>
    ),
    close: (
      <>
        <Path d="M18 6L6 18M6 6l12 12" {...s} />
      </>
    ),
    back: (
      <>
        <Path d="M19 12H5M12 5l-7 7 7 7" {...s} />
      </>
    ),
    bell: (
      <>
        <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" {...s} />
        <Path d="M13.73 21a2 2 0 01-3.46 0" {...s} />
      </>
    ),
    calendar: (
      <>
        <Rect x="3" y="4" width="18" height="18" rx="2" {...s} />
        <Path d="M16 2v4M8 2v4M3 10h18" {...s} />
      </>
    ),
    dots: (
      <>
        <Circle cx="12" cy="5" r="1" fill={color} stroke={color} strokeWidth="0" />
        <Circle cx="12" cy="12" r="1" fill={color} stroke={color} strokeWidth="0" />
        <Circle cx="12" cy="19" r="1" fill={color} stroke={color} strokeWidth="0" />
      </>
    ),
    camera: (
      <>
        <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" {...s} />
        <Circle cx="12" cy="13" r="4" {...s} />
      </>
    ),
    mic: (
      <>
        <Rect x="9" y="2" width="6" height="11" rx="3" {...s} />
        <Path d="M5 10a7 7 0 0014 0" {...s} />
        <Path d="M12 19v3M9 22h6" {...s} />
      </>
    ),
    send: (
      <>
        <Path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" {...s} />
      </>
    ),
    food: (
      <>
        <Path d="M18 8h1a4 4 0 010 8h-1" {...s} />
        <Path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" {...s} />
        <Path d="M6 1v3M10 1v3M14 1v3" {...s} />
      </>
    ),
    transport: (
      <>
        <Rect x="1" y="3" width="15" height="13" rx="2" {...s} />
        <Path d="M16 8h4l3 3v5h-7V8z" {...s} />
        <Circle cx="5.5" cy="18.5" r="2.5" {...s} />
        <Circle cx="18.5" cy="18.5" r="2.5" {...s} />
      </>
    ),
    shopping: (
      <>
        <Path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" {...s} />
        <Path d="M3 6h18" {...s} />
        <Path d="M16 10a4 4 0 01-8 0" {...s} />
      </>
    ),
    health: (
      <>
        <Path d="M22 12h-4l-3 9L9 3l-3 9H2" {...s} />
      </>
    ),
    entertainment: (
      <>
        <Path d="M9 18V5l12-2v13" {...s} />
        <Circle cx="6" cy="18" r="3" {...s} />
        <Circle cx="18" cy="16" r="3" {...s} />
      </>
    ),
    salary: (
      <>
        <Rect x="2" y="5" width="20" height="14" rx="2" {...s} />
        <Path d="M12 12a3 3 0 100-6 3 3 0 000 6z" {...s} />
        <Path d="M12 12v3" {...s} />
      </>
    ),
    freelance: (
      <>
        <Path d="M12 2L2 7l10 5 10-5-10-5z" {...s} />
        <Path d="M2 17l10 5 10-5" {...s} />
        <Path d="M2 12l10 5 10-5" {...s} />
      </>
    ),
    rent: (
      <>
        <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" {...s} />
        <Path d="M9 22V12h6v10" {...s} />
      </>
    ),
    utilities: (
      <>
        <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" {...s} />
      </>
    ),
    savings: (
      <>
        <Path d="M19 5H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2z" {...s} />
        <Path d="M16 11a1 1 0 100-2 1 1 0 000 2z" fill={color} stroke="none" />
        <Path d="M1 9h4M1 15h4" {...s} />
      </>
    ),
    education: (
      <>
        <Path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" {...s} />
        <Path d="M6 12v5c3 3 9 3 12 0v-5" {...s} />
      </>
    ),
    travel: (
      <>
        <Path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" {...s} />
        <Circle cx="12" cy="10" r="3" {...s} />
      </>
    ),
    gifts: (
      <>
        <Path d="M20 12v10H4V12" {...s} />
        <Path d="M22 7H2v5h20V7z" {...s} />
        <Path d="M12 22V7" {...s} />
        <Path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" {...s} />
        <Path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" {...s} />
      </>
    ),
    insurance: (
      <>
        <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...s} />
      </>
    ),
    other: (
      <>
        <Circle cx="12" cy="12" r="1" fill={color} stroke="none" />
        <Circle cx="5" cy="12" r="1" fill={color} stroke="none" />
        <Circle cx="19" cy="12" r="1" fill={color} stroke="none" />
      </>
    ),
    chevronRight: (
      <>
        <Path d="M9 18l6-6-6-6" {...s} />
      </>
    ),
    chevronLeft: (
      <>
        <Path d="M15 18l-6-6 6-6" {...s} />
      </>
    ),
    chevronDown: (
      <>
        <Path d="M6 9l6 6 6-6" {...s} />
      </>
    ),
    check: (
      <>
        <Path d="M20 6L9 17l-5-5" {...s} />
      </>
    ),
    star: (
      <>
        <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" {...s} />
      </>
    ),
    heart: (
      <>
        <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" {...s} />
      </>
    ),
    trash: (
      <>
        <Path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6" {...s} />
        <Path d="M9 6V4h6v2" {...s} />
      </>
    ),
    edit: (
      <>
        <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" {...s} />
        <Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" {...s} />
      </>
    ),
    filter: (
      <>
        <Path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" {...s} />
      </>
    ),
    search: (
      <>
        <Circle cx="11" cy="11" r="8" {...s} />
        <Path d="M21 21l-4.35-4.35" {...s} />
      </>
    ),
    settings: (
      <>
        <Circle cx="12" cy="12" r="3" {...s} />
        <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" {...s} />
      </>
    ),
    plus: (
      <>
        <Path d="M12 5v14M5 12h14" {...s} />
      </>
    ),
    crown: (
      <>
        <Path d="M2 20h20M4 20L2 8l6 4 4-7 4 7 6-4-2 12H4z" {...s} />
      </>
    ),
  };

  const paths = icons[name] ?? (
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6" fill="none" />
  );

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {paths}
    </Svg>
  );
}
