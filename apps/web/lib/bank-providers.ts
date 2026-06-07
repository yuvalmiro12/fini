// Lightweight provider metadata for the "connect bank account" UI.
// Mirrors israeli-bank-scrapers' SCRAPERS map (definitions.ts) but is a tiny
// static table on purpose — we must NOT import the scraper in the browser
// (it pulls in Puppeteer/Chromium). The `id` is the scraper CompanyTypes id.

export type LoginFieldKey =
  | 'username' | 'userCode' | 'password' | 'id' | 'num'
  | 'card6Digits' | 'nationalID' | 'email';

export const FIELD_META: Record<LoginFieldKey, { label: string; type: 'text' | 'password'; placeholder?: string }> = {
  username:    { label: 'שם משתמש', type: 'text' },
  userCode:    { label: 'קוד משתמש', type: 'text' },
  password:    { label: 'סיסמה', type: 'password' },
  id:          { label: 'תעודת זהות', type: 'text' },
  num:         { label: 'מספר מזהה / קוד סניף', type: 'text' },
  card6Digits: { label: '6 ספרות אחרונות בכרטיס', type: 'text', placeholder: '••••••' },
  nationalID:  { label: 'תעודת זהות', type: 'text' },
  email:       { label: 'אימייל', type: 'text' },
}

export type BankProvider = {
  id: string            // scraper CompanyTypes id (companyId)
  label: string         // Hebrew display name
  kind: 'bank' | 'card'
  loginFields: LoginFieldKey[]
  unsupported?: boolean // true → shown but not selectable (e.g. requires 2FA)
  note?: string
}

export const BANK_PROVIDERS: BankProvider[] = [
  // Banks
  { id: 'hapoalim', label: 'בנק הפועלים', kind: 'bank', loginFields: ['userCode', 'password'] },
  { id: 'leumi', label: 'בנק לאומי', kind: 'bank', loginFields: ['username', 'password'] },
  { id: 'mizrahi', label: 'מזרחי טפחות', kind: 'bank', loginFields: ['username', 'password'] },
  { id: 'discount', label: 'בנק דיסקונט', kind: 'bank', loginFields: ['id', 'password', 'num'] },
  { id: 'mercantile', label: 'בנק מרכנתיל', kind: 'bank', loginFields: ['id', 'password', 'num'] },
  { id: 'otsarHahayal', label: 'אוצר החייל', kind: 'bank', loginFields: ['username', 'password'] },
  { id: 'beinleumi', label: 'הבינלאומי', kind: 'bank', loginFields: ['username', 'password'] },
  { id: 'union', label: 'בנק איגוד', kind: 'bank', loginFields: ['username', 'password'] },
  { id: 'massad', label: 'בנק מסד', kind: 'bank', loginFields: ['username', 'password'] },
  { id: 'yahav', label: 'בנק יהב', kind: 'bank', loginFields: ['username', 'nationalID', 'password'] },
  { id: 'pagi', label: 'פאג"י', kind: 'bank', loginFields: ['username', 'password'] },
  { id: 'oneZero', label: 'וואן זירו (One Zero)', kind: 'bank', loginFields: ['email', 'password'], unsupported: true, note: 'דורש אימות דו-שלבי (OTP) — בקרוב' },
  // Credit cards
  { id: 'visaCal', label: 'Cal (כאל)', kind: 'card', loginFields: ['username', 'password'] },
  { id: 'max', label: 'Max (לאומי קארד)', kind: 'card', loginFields: ['username', 'password'] },
  { id: 'isracard', label: 'ישראכרט', kind: 'card', loginFields: ['id', 'card6Digits', 'password'] },
  { id: 'amex', label: 'אמריקן אקספרס', kind: 'card', loginFields: ['id', 'card6Digits', 'password'] },
  { id: 'behatsdaa', label: 'בהצדעה', kind: 'card', loginFields: ['id', 'password'] },
  { id: 'beyahadBishvilha', label: 'ביחד בשבילך', kind: 'card', loginFields: ['id', 'password'] },
]

export function getProvider(id: string): BankProvider | undefined {
  return BANK_PROVIDERS.find((p) => p.id === id)
}
