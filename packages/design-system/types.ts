export interface Transaction {
  id: string;
  cat: string;
  title: string;
  subtitle: string;
  amount: number; // negative = expense, positive = income
  date: string;
  flag?: string;
  paymentMethod?: string;
  address?: string;
}

export interface TransactionGroup {
  label: string;
  items: Transaction[];
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  monthly: number;
  eta: string; // month name
  emoji?: string;
}

export interface Message {
  id: string;
  role: 'fini' | 'user';
  body: string;
  createdAt: string;
  suggestionChips?: { t: string; icon?: string }[];
  attachments?: string[];
}

export interface User {
  name: string;
  partner?: string;
  locale: 'he';
  plan: 'free' | 'pro' | 'proPlus';
}

export interface SharedBudget {
  limit: number;
  spent: number;
  noa: number;
  yonatan: number;
}
