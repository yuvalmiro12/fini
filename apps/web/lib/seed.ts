export interface Transaction {
  id: string
  title: string
  category: string
  amount: number
  type: 'income' | 'expense'
  date: string
  time: string
  note?: string
  shared?: boolean
  flagged?: boolean
}

export interface ChatMessage {
  id: string
  role: 'fini' | 'user'
  text?: string
  type?: 'text' | 'txChip' | 'insight' | 'suggestions'
  txId?: string
  suggestions?: string[]
  insight?: InsightData
}

export interface InsightData {
  title: string
  body: string
  bars: number[]
  days: string[]
}

export interface SavingsGoal {
  id: string
  title: string
  target: number
  current: number
  deadline: string
  emoji: string
}

export interface SharedBudget {
  id: string
  title: string
  members: { name: string; initial: string; color: string }[]
  total: number
  spent: number
  transactions: Transaction[]
}

export const TRANSACTIONS: Transaction[] = [
  { id: 't1', title: 'סופרמרקט שופרסל', category: 'food', amount: 284, type: 'expense', date: '2026-04-18', time: '18:42', flagged: false },
  { id: 't2', title: 'מונית גט', category: 'transport', amount: 47, type: 'expense', date: '2026-04-18', time: '09:15' },
  { id: 't3', title: 'משכורת אפריל', category: 'income', amount: 12400, type: 'income', date: '2026-04-17', time: '08:00' },
  { id: 't4', title: 'נטפליקס', category: 'entertainment', amount: 52, type: 'expense', date: '2026-04-16', time: '00:00', note: 'חיוב חודשי' },
  { id: 't5', title: 'בית קפה לנדוור', category: 'food', amount: 67, type: 'expense', date: '2026-04-15', time: '11:30' },
  { id: 't6', title: 'חשמל ומים', category: 'utilities', amount: 340, type: 'expense', date: '2026-04-14', time: '09:00', flagged: true },
  { id: 't7', title: 'ZARA', category: 'shopping', amount: 450, type: 'expense', date: '2026-04-13', time: '16:20' },
  { id: 't8', title: 'רכבת ישראל', category: 'transport', amount: 28, type: 'expense', date: '2026-04-12', time: '08:00' },
  { id: 't9', title: 'מתנה ליום הולדת', category: 'gifts', amount: 200, type: 'expense', date: '2026-04-11', time: '14:00' },
  { id: 't10', title: 'פלאפון - חיוב חודשי', category: 'phone', amount: 89, type: 'expense', date: '2026-04-10', time: '00:00' },
  { id: 't11', title: 'עבודה פרילנס', category: 'income', amount: 3200, type: 'income', date: '2026-04-09', time: '12:00' },
  { id: 't12', title: 'מסעדת אורה', category: 'food', amount: 180, type: 'expense', date: '2026-04-08', time: '20:30' },
  { id: 't13', title: 'חנות ספרים', category: 'entertainment', amount: 95, type: 'expense', date: '2026-04-07', time: '15:00' },
  { id: 't14', title: 'חיסכון חודשי', category: 'savings', amount: 1000, type: 'expense', date: '2026-04-05', time: '09:00' },
  { id: 't15', title: 'דלק', category: 'transport', amount: 220, type: 'expense', date: '2026-04-04', time: '17:00' },
]

export const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    role: 'fini',
    type: 'text',
    text: 'שלום\! אני פיני, העוזר הפיננסי שלך. איך אפשר לעזור היום?',
  },
  {
    id: 'm2',
    role: 'user',
    type: 'text',
    text: 'כמה הוצאתי השבוע?',
  },
  {
    id: 'm3',
    role: 'fini',
    type: 'insight',
    insight: {
      title: 'הוצאות השבוע',
      body: 'השבוע הוצאת **₪816** — **12%** יותר מהשבוע שעבר. הרוב הלך לאוכל ותחבורה.',
      bars: [45, 60, 80, 55, 90, 70, 100],
      days: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
    },
  },
  {
    id: 'm4',
    role: 'fini',
    type: 'suggestions',
    suggestions: ['ראה פירוט קטגוריות', 'השווה לחודש שעבר', 'טיפים לחיסכון'],
  },
  {
    id: 'm5',
    role: 'user',
    type: 'text',
    text: 'מה הוצאה הכי גדולה?',
  },
  {
    id: 'm6',
    role: 'fini',
    type: 'txChip',
    text: 'ההוצאה הגדולה ביותר השבוע:',
    txId: 't1',
  },
]

export const SAVINGS_GOAL: SavingsGoal = {
  id: 'g1',
  title: 'חופשה באירופה',
  target: 15000,
  current: 8400,
  deadline: '2026-08-01',
  emoji: 'flight',
}

export const SHARED_BUDGET: SharedBudget = {
  id: 'sb1',
  title: 'תקציב משותף',
  members: [
    { name: 'נועה', initial: 'נ', color: '#C85A8A' },
    { name: 'יונתן', initial: 'י', color: '#5A6FB8' },
  ],
  total: 8000,
  spent: 5340,
  transactions: [
    { id: 'st1', title: 'סופרמרקט', category: 'food', amount: 520, type: 'expense', date: '2026-04-18', time: '18:00', shared: true },
    { id: 'st2', title: 'חשמל', category: 'utilities', amount: 340, type: 'expense', date: '2026-04-14', time: '09:00', shared: true },
    { id: 'st3', title: 'ארנונה', category: 'home', amount: 780, type: 'expense', date: '2026-04-01', time: '09:00', shared: true },
    { id: 'st4', title: 'אינטרנט', category: 'utilities', amount: 99, type: 'expense', date: '2026-04-01', time: '00:00', shared: true },
  ],
}
