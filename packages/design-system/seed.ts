import type { Transaction, TransactionGroup, SavingsGoal, Message, SharedBudget, User } from './types';

export const SEED_USER: User = {
  name: 'נועה',
  partner: 'יונתן',
  locale: 'he',
  plan: 'proPlus',
};

export const SEED_TRANSACTIONS: TransactionGroup[] = [
  {
    label: 'היום · 14 בנובמבר',
    items: [
      { id: 't1', cat: 'food', title: 'לחמים', subtitle: '08:12 · כרטיס אשראי', amount: -68, date: '2024-11-14', address: 'רחוב אבן גבירול 139, תל אביב', paymentMethod: 'כרטיס אשראי · 4821' },
      { id: 't2', cat: 'salary', title: 'משכורת · סטארטאפ', subtitle: '07:30 · העברה', amount: 12400, date: '2024-11-14' },
    ],
  },
  {
    label: 'אתמול',
    items: [
      { id: 't3', cat: 'grocery', title: 'שופרסל דיל', subtitle: 'מכולת', amount: -214, date: '2024-11-13' },
      { id: 't4', cat: 'transport', title: 'Gett', subtitle: 'תחבורה · ×3', amount: -82, date: '2024-11-13' },
      { id: 't5', cat: 'fun', title: 'סינמה סיטי', subtitle: 'בילוי', amount: -96, date: '2024-11-13' },
    ],
  },
  {
    label: '12 בנובמבר',
    items: [
      { id: 't6', cat: 'rent', title: 'שכר דירה · נובמבר', subtitle: 'הוראת קבע', amount: -3200, date: '2024-11-12' },
      { id: 't7', cat: 'phone', title: 'Bezeq', subtitle: 'אינטרנט', amount: -99, date: '2024-11-12', flag: 'זוהה כחדש' },
      { id: 't8', cat: 'utility', title: 'חברת חשמל', subtitle: 'חשבונות', amount: -288, date: '2024-11-12' },
    ],
  },
];

export const SEED_SAVINGS_GOAL: SavingsGoal = {
  id: 'sg1',
  name: 'טיול ליפן · אוקטובר 2026',
  target: 15000,
  current: 8420,
  monthly: 650,
  eta: 'אוג',
  emoji: '🗾',
};

export const SEED_CHAT: Message[] = [
  { id: 'm1', role: 'fini', body: 'בוקר טוב נועה ☀️ שמחה לראות אותך.', createdAt: '08:00' },
  { id: 'm2', role: 'fini', body: 'הבוקר נכנסה משכורת של **₪12,400**. רוצה שנחלק אותה לפי היעדים שלך?', createdAt: '08:00', suggestionChips: [{ t: 'חלקי אוטומטית', icon: 'sparkle' }, { t: 'לא תודה' }, { t: 'תזכירי לי בערב' }] },
  { id: 'm3', role: 'user', body: 'שילמתי 68 ש״ח על קפה ומאפה ב״לחמים״', createdAt: '08:15' },
  { id: 'm4', role: 'fini', body: 'סידרתי\! הוספתי למסעדות:', createdAt: '08:15', suggestionChips: [{ t: 'קבעי תקציב לקטגוריה', icon: 'target' }, { t: 'הראי לי פירוט' }] },
];

export const SEED_BUDGET: SharedBudget = {
  limit: 5000,
  spent: 3140,
  noa: 1820,
  yonatan: 1320,
};
