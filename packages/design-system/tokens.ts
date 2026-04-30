export const FINI = {
  // base
  cream: '#F7F5E8',
  creamDark: '#EFEADA',
  ink: '#1F1A15',
  inkSoft: '#4A4237',
  inkMute: '#8A8070',
  line: 'rgba(31,26,21,0.08)',
  lineSoft: 'rgba(31,26,21,0.05)',
  // rose (chat)
  rose: '#FDDDE8',
  roseDeep: '#F9C6D7',
  pink: '#C85A8A',
  pinkSoft: '#E89AB3',
  // mint (insights)
  mint: '#D6EEE0',
  mintDeep: '#BEE3CB',
  green: '#5B8E6F',
  greenSoft: '#A7C9B4',
  // lavender (data)
  lavender: '#E8ECFF',
  lavenderDeep: '#D4DBFA',
  blue: '#5A6FB8',
  blueSoft: '#A5B0D8',
  // finance semantics
  income: '#5B8E6F',
  incomeTint: '#DDEEDF',
  expense: '#D47070',
  expenseTint: '#FADEDC',
  gold: '#C9A24D',
  goldTint: '#F3E7C7',
  // typography
  font: '"Rubik", -apple-system, system-ui, sans-serif',
  // radii
  radiusSm: 10,
  radiusMd: 16,
  radiusLg: 22,
  radiusXl: 28,
  // shadows
  shadowCard: '0 1px 2px rgba(31,26,21,0.04)',
  shadowLifted: '0 4px 16px rgba(31,26,21,0.06)',
  shadowSheet: '0 -8px 30px rgba(31,26,21,0.15)',
  shadowPink: '0 8px 24px rgba(200,90,138,0.3)',
  shadowGold: '0 2px 6px rgba(201,162,77,0.3)',
};

export type TabId = 'chat' | 'insights' | 'data';
export type ScreenId = 'chat' | 'brief' | 'addTx' | 'insights' | 'savings' | 'data' | 'transactions' | 'couples' | 'paywall' | 'txDetail' | 'obWelcome' | 'obGoal' | 'obIncome' | 'obPlan';
export type PlanId = 'free' | 'pro' | 'proPlus';
