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

export const TRANSACTIONS: Transaction[] = []

export const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    role: 'fini',
    type: 'text',
    text: 'שלום! אני פיני, העוזר הפיננסי שלך. איך אפשר לעזור היום?',
  },
]

export const SAVINGS_GOAL: SavingsGoal = {
  id: 'g1',
  title: '',
  target: 0,
  current: 0,
  deadline: '',
  emoji: 'savings',
}

export const SHARED_BUDGET: SharedBudget = {
  id: 'sb1',
  title: 'תקציב משותף',
  members: [],
  total: 0,
  spent: 0,
  transactions: [],
}
