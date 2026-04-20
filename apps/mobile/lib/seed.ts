export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  merchant: string;
  date: string;
  note?: string;
}

export interface SavingsGoal {
  id: string;
  label: string;
  target: number;
  saved: number;
  emoji: string;
  color: string;
  tint: string;
  deadline?: string;
}

export interface InsightItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'warning' | 'tip' | 'achievement';
  icon: string;
}

export const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    amount: 12500,
    type: 'income',
    category: 'salary',
    merchant: 'חברת הייטק בע"מ',
    date: '2026-04-01',
    note: 'משכורת אפריל',
  },
  {
    id: 'tx2',
    amount: 245,
    type: 'expense',
    category: 'food',
    merchant: 'רמי לוי',
    date: '2026-04-18',
  },
  {
    id: 'tx3',
    amount: 89,
    type: 'expense',
    category: 'food',
    merchant: 'קפה גרג',
    date: '2026-04-17',
  },
  {
    id: 'tx4',
    amount: 3200,
    type: 'expense',
    category: 'rent',
    merchant: 'שכר דירה אפריל',
    date: '2026-04-01',
  },
  {
    id: 'tx5',
    amount: 180,
    type: 'expense',
    category: 'transport',
    merchant: 'רב-קו',
    date: '2026-04-15',
  },
  {
    id: 'tx6',
    amount: 560,
    type: 'expense',
    category: 'shopping',
    merchant: 'זארה',
    date: '2026-04-14',
  },
  {
    id: 'tx7',
    amount: 320,
    type: 'expense',
    category: 'entertainment',
    merchant: 'נטפליקס + ספוטיפיי',
    date: '2026-04-10',
  },
  {
    id: 'tx8',
    amount: 150,
    type: 'expense',
    category: 'health',
    merchant: 'מכבי שירותי בריאות',
    date: '2026-04-09',
  },
  {
    id: 'tx9',
    amount: 2000,
    type: 'income',
    category: 'freelance',
    merchant: 'פרויקט עיצוב',
    date: '2026-04-08',
  },
  {
    id: 'tx10',
    amount: 95,
    type: 'expense',
    category: 'food',
    merchant: 'מקדונלדס',
    date: '2026-04-07',
  },
  {
    id: 'tx11',
    amount: 450,
    type: 'expense',
    category: 'utilities',
    merchant: 'חשמל + מים',
    date: '2026-04-05',
  },
  {
    id: 'tx12',
    amount: 200,
    type: 'expense',
    category: 'education',
    merchant: 'קורס אונליין',
    date: '2026-04-03',
  },
  {
    id: 'tx13',
    amount: 67,
    type: 'expense',
    category: 'food',
    merchant: 'שוק הכרמל',
    date: '2026-03-30',
  },
  {
    id: 'tx14',
    amount: 350,
    type: 'expense',
    category: 'travel',
    merchant: 'ויזה למלון',
    date: '2026-03-28',
  },
  {
    id: 'tx15',
    amount: 120,
    type: 'expense',
    category: 'gifts',
    merchant: 'מתנה ליום הולדת',
    date: '2026-03-25',
  },
];

export const SEED_SAVINGS: SavingsGoal[] = [
  {
    id: 'sg1',
    label: 'חופשה באירופה',
    target: 15000,
    saved: 8400,
    emoji: '✈️',
    color: '#5A6FB8',
    tint: '#E8ECFF',
    deadline: '2026-08-01',
  },
  {
    id: 'sg2',
    label: 'קרן חירום',
    target: 30000,
    saved: 18500,
    emoji: '🛡️',
    color: '#5B8E6F',
    tint: '#D6EEE0',
  },
  {
    id: 'sg3',
    label: 'מחשב חדש',
    target: 6000,
    saved: 2200,
    emoji: '💻',
    color: '#C9A24D',
    tint: '#F3E7C7',
    deadline: '2026-06-01',
  },
];

export const SEED_INSIGHTS: InsightItem[] = [
  {
    id: 'ins1',
    title: 'הוצאות אוכל גבוהות ב-32%',
    subtitle: 'הוצאת ₪491 על אוכל החודש, לעומת ₪372 בממוצע',
    type: 'warning',
    icon: 'food',
  },
  {
    id: 'ins2',
    title: 'חסכת ₪500 על בידור\!',
    subtitle: 'ביטלת את המנוי הכפול לנטפליקס — כל הכבוד',
    type: 'achievement',
    icon: 'entertainment',
  },
  {
    id: 'ins3',
    title: 'טיפ: הגדר העברה אוטומטית',
    subtitle: 'הפקד ₪800 בחודש לחיסכון באירופה ותגיע ביולי',
    type: 'tip',
    icon: 'savings',
  },
];

export const SEED_CHAT_MESSAGES = [
  {
    id: 'msg1',
    role: 'assistant' as const,
    text: 'היי\! אני פיני 👋\nאני כאן לעזור לך לנהל את הכסף שלך בחכמה. מה תרצה לעשות היום?',
    date: '2026-04-19T09:00:00Z',
  },
  {
    id: 'msg2',
    role: 'user' as const,
    text: 'כמה הוצאתי החודש?',
    date: '2026-04-19T09:01:00Z',
  },
  {
    id: 'msg3',
    role: 'assistant' as const,
    text: 'החודש הוצאת ₪5,661 עד כה.\n\nהפירוט:\n• שכר דירה: ₪3,200\n• אוכל: ₪491\n• קניות: ₪560\n• בידור: ₪320\n• תחבורה: ₪180\n• אחר: ₪910',
    date: '2026-04-19T09:01:15Z',
  },
];

// Monthly chart data (last 6 months)
export const SEED_MONTHLY_DATA = [
  { month: 'נוב', income: 13200, expense: 9800 },
  { month: 'דצמ', income: 14500, expense: 12300 },
  { month: 'ינו', income: 12500, expense: 10100 },
  { month: 'פבר', income: 12500, expense: 9400 },
  { month: 'מרץ', income: 14500, expense: 11200 },
  { month: 'אפר', income: 14500, expense: 5661 },
];
