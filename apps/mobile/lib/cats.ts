export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  tint: string;
  type: 'expense' | 'income' | 'both';
}

export const CATS: Record<string, Category> = {
  food: {
    id: 'food',
    label: 'אוכל ומסעדות',
    icon: 'food',
    color: '#C9A24D',
    tint: '#F3E7C7',
    type: 'expense',
  },
  transport: {
    id: 'transport',
    label: 'תחבורה',
    icon: 'transport',
    color: '#5A6FB8',
    tint: '#E8ECFF',
    type: 'expense',
  },
  shopping: {
    id: 'shopping',
    label: 'קניות',
    icon: 'shopping',
    color: '#C85A8A',
    tint: '#FDDDE8',
    type: 'expense',
  },
  health: {
    id: 'health',
    label: 'בריאות',
    icon: 'health',
    color: '#5B8E6F',
    tint: '#D6EEE0',
    type: 'expense',
  },
  entertainment: {
    id: 'entertainment',
    label: 'בידור',
    icon: 'entertainment',
    color: '#8A8070',
    tint: '#EFEADA',
    type: 'expense',
  },
  salary: {
    id: 'salary',
    label: 'משכורת',
    icon: 'salary',
    color: '#5B8E6F',
    tint: '#D6EEE0',
    type: 'income',
  },
  freelance: {
    id: 'freelance',
    label: 'עצמאי',
    icon: 'freelance',
    color: '#C9A24D',
    tint: '#F3E7C7',
    type: 'income',
  },
  rent: {
    id: 'rent',
    label: 'שכר דירה',
    icon: 'rent',
    color: '#D47070',
    tint: '#FDDDE8',
    type: 'expense',
  },
  utilities: {
    id: 'utilities',
    label: 'חשבונות',
    icon: 'utilities',
    color: '#5A6FB8',
    tint: '#E8ECFF',
    type: 'expense',
  },
  savings: {
    id: 'savings',
    label: 'חיסכון',
    icon: 'savings',
    color: '#5B8E6F',
    tint: '#D6EEE0',
    type: 'both',
  },
  education: {
    id: 'education',
    label: 'חינוך',
    icon: 'education',
    color: '#5A6FB8',
    tint: '#E8ECFF',
    type: 'expense',
  },
  travel: {
    id: 'travel',
    label: 'נסיעות',
    icon: 'travel',
    color: '#C9A24D',
    tint: '#F3E7C7',
    type: 'expense',
  },
  gifts: {
    id: 'gifts',
    label: 'מתנות',
    icon: 'gifts',
    color: '#C85A8A',
    tint: '#FDDDE8',
    type: 'expense',
  },
  insurance: {
    id: 'insurance',
    label: 'ביטוח',
    icon: 'insurance',
    color: '#8A8070',
    tint: '#EFEADA',
    type: 'expense',
  },
  other: {
    id: 'other',
    label: 'אחר',
    icon: 'other',
    color: '#8A8070',
    tint: '#EFEADA',
    type: 'both',
  },
};
