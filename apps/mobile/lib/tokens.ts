export const TOKENS = {
  // Backgrounds
  cream: '#F7F5E8',
  creamDark: '#EFEADA',

  // Text
  ink: '#1F1A15',
  inkSoft: '#4A4237',
  inkMute: '#8A8070',

  // Rose / Pink
  rose: '#FDDDE8',
  pink: '#C85A8A',

  // Mint / Green
  mint: '#D6EEE0',
  mintDeep: '#BEE3CB',
  green: '#5B8E6F',

  // Lavender / Blue
  lavender: '#E8ECFF',
  lavenderDeep: '#D4DBFA',
  blue: '#5A6FB8',

  // Finance
  income: '#5B8E6F',
  expense: '#D47070',
  gold: '#C9A24D',
  goldTint: '#F3E7C7',

  // Fonts
  fontRegular: 'Rubik_400Regular',
  fontMedium: 'Rubik_500Medium',
  fontSemiBold: 'Rubik_600SemiBold',
  fontBold: 'Rubik_700Bold',

  // Spacing
  space1: 4,
  space2: 8,
  space3: 12,
  space4: 16,
  space5: 20,
  space6: 24,
  space8: 32,
  space10: 40,
  space12: 48,

  // Radius
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 9999,
} as const;

export type TokenKey = keyof typeof TOKENS;
