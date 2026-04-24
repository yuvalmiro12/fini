/**
 * Insight templates + mock AI generator.
 *
 * v2 — tagged-union of 5 types, each with a unique visual treatment:
 *   • trend     → sparkline + delta%
 *   • budget    → progress bar "used / total"
 *   • anomaly   → highlights a specific transaction
 *   • streak    → counter with unit ("3 שבועות ברציפות")
 *   • milestone → celebratory state with progress %
 */

export type InsightType = 'trend' | 'budget' | 'anomaly' | 'streak' | 'milestone'

interface InsightBase {
  id: string
  icon: string
  title: string
  subtitle: string
  tint: string
  ink: string
  value: string
  positive: boolean
}

export interface TrendInsight extends InsightBase {
  type: 'trend'
  sparkline: number[]   // normalised 0..1 samples, 7 points typical
  delta: number         // % delta vs last period (may be negative)
}

export interface BudgetInsight extends InsightBase {
  type: 'budget'
  used: number
  total: number
  unit?: string         // default '₪'
}

export interface AnomalyInsight extends InsightBase {
  type: 'anomaly'
  txTitle: string
  txAmount: number
  comparison: string    // e.g. "פי 3.2 מהממוצע"
}

export interface StreakInsight extends InsightBase {
  type: 'streak'
  count: number
  unit: string          // "שבועות" | "ימים"
  context: string       // "מתחת לממוצע קפה"
}

export interface MilestoneInsight extends InsightBase {
  type: 'milestone'
  progress: number      // 0..1
  caption: string       // "₪10,000 בחיסכון!"
}

export type Insight =
  | TrendInsight
  | BudgetInsight
  | AnomalyInsight
  | StreakInsight
  | MilestoneInsight

// Color palettes we can pick from for new insights
const PALETTES = [
  { tint: '#D6EEE0', ink: '#5B8E6F' }, // green
  { tint: '#FADEDC', ink: '#D47070' }, // red
  { tint: '#F3E7C7', ink: '#C9A24D' }, // yellow
  { tint: '#D4DBFA', ink: '#5A6FB8' }, // blue
  { tint: '#FDDDE8', ink: '#C85A8A' }, // pink
  { tint: '#E8DCFF', ink: '#7B5AB8' }, // purple
]

// -- Sparkline generator helpers ----------------------------------------

/** Produces a smooth-ish random 7-point sparkline in [0,1] */
function genSparkline(trend: 'up' | 'down' | 'flat' = 'flat'): number[] {
  const n = 7
  const base = trend === 'up' ? 0.3 : trend === 'down' ? 0.7 : 0.5
  const slope = trend === 'up' ? 0.055 : trend === 'down' ? -0.055 : 0
  const out: number[] = []
  for (let i = 0; i < n; i++) {
    const noise = (Math.random() - 0.5) * 0.22
    out.push(Math.max(0.05, Math.min(0.98, base + slope * i + noise)))
  }
  return out
}

// -- Ready-made templates ----------------------------------------------

export const INSIGHT_TEMPLATES: Insight[] = [
  // Trend — food down
  {
    type: 'trend', id: 'tmpl_food', icon: 'coffee',
    title: 'הוצאות אוכל', subtitle: 'ירדו ב-8% מהחודש שעבר',
    tint: '#D6EEE0', ink: '#5B8E6F', value: '-8%', positive: true,
    sparkline: [0.62, 0.58, 0.64, 0.5, 0.48, 0.42, 0.4], delta: -8,
  },
  // Budget — shopping over
  {
    type: 'budget', id: 'tmpl_shop', icon: 'cart',
    title: 'תקציב קניות', subtitle: 'חרגת ב-15% מהתקציב',
    tint: '#FADEDC', ink: '#D47070', value: '115%', positive: false,
    used: 1150, total: 1000,
  },
  // Trend — bills up
  {
    type: 'trend', id: 'tmpl_bills', icon: 'bolt',
    title: 'חשבונות', subtitle: 'גבוה ב-23% מהממוצע',
    tint: '#F3E7C7', ink: '#C9A24D', value: '+23%', positive: false,
    sparkline: [0.4, 0.42, 0.48, 0.55, 0.58, 0.7, 0.82], delta: 23,
  },
  // Milestone — savings
  {
    type: 'milestone', id: 'tmpl_save', icon: 'piggy',
    title: 'יעד חיסכון', subtitle: 'עברת חצי מהדרך ליעד',
    tint: '#D4DBFA', ink: '#5A6FB8', value: '56%', positive: true,
    progress: 0.56, caption: '₪8,400 בחיסכון',
  },
  // Budget — coffee
  {
    type: 'budget', id: 'tmpl_coffee', icon: 'coffee',
    title: 'קפה החודש', subtitle: '₪420 מתוך תקציב ₪500',
    tint: '#F3E7C7', ink: '#C9A24D', value: '₪420', positive: true,
    used: 420, total: 500,
  },
  // Trend — transport down
  {
    type: 'trend', id: 'tmpl_trans', icon: 'car',
    title: 'תחבורה', subtitle: 'ירידה של 12% — עבודה מהבית',
    tint: '#D4DBFA', ink: '#5A6FB8', value: '-12%', positive: true,
    sparkline: [0.72, 0.68, 0.6, 0.55, 0.5, 0.48, 0.46], delta: -12,
  },
  // Streak — coffee
  {
    type: 'streak', id: 'tmpl_streak_coffee', icon: 'coffee',
    title: 'שובר שיאים', subtitle: '3 שבועות מתחת לממוצע קפה',
    tint: '#FDDDE8', ink: '#C85A8A', value: '3', positive: true,
    count: 3, unit: 'שבועות', context: 'מתחת לממוצע קפה',
  },
  // Anomaly — large purchase
  {
    type: 'anomaly', id: 'tmpl_anomaly_shop', icon: 'sparkle',
    title: 'עסקה חריגה', subtitle: 'רכישה יוצאת דופן השבוע',
    tint: '#FDDDE8', ink: '#C85A8A', value: '₪540', positive: false,
    txTitle: 'ZARA פתח תקווה', txAmount: 540, comparison: 'פי 3.2 מהממוצע שלך בקטגוריה',
  },
  // Trend — entertainment over
  {
    type: 'trend', id: 'tmpl_ent', icon: 'sparkle',
    title: 'בילויים', subtitle: 'קצת מעל התקציב החודשי',
    tint: '#FDDDE8', ink: '#C85A8A', value: '+7%', positive: false,
    sparkline: [0.5, 0.48, 0.52, 0.55, 0.6, 0.62, 0.6], delta: 7,
  },
  // Milestone — streak of savings
  {
    type: 'milestone', id: 'tmpl_milestone_saving', icon: 'target',
    title: 'יעד חודשי', subtitle: 'השלמת את היעד של החודש!',
    tint: '#D6EEE0', ink: '#5B8E6F', value: '100%', positive: true,
    progress: 1, caption: 'החודש נחסכו ₪2,200',
  },
  // Budget — subscriptions
  {
    type: 'budget', id: 'tmpl_subs', icon: 'sparkle',
    title: 'מנויים', subtitle: '8 מנויים פעילים',
    tint: '#F3E7C7', ink: '#C9A24D', value: '₪240', positive: false,
    used: 240, total: 300,
  },
  // Streak — budget kept
  {
    type: 'streak', id: 'tmpl_streak_budget', icon: 'target',
    title: 'עמדת בתקציב', subtitle: '5 שבועות ברציפות',
    tint: '#D4DBFA', ink: '#5A6FB8', value: '5', positive: true,
    count: 5, unit: 'שבועות', context: 'של עמידה בתקציב',
  },
]

// Simple keyword → type + template hints for the mock AI generator
const KEYWORD_MAP: Array<{
  keywords: string[]
  icon: string
  title: string
  preferType?: InsightType
}> = [
  { keywords: ['אוכל', 'מסעדה', 'מסעדות', 'סופר', 'סופרמרקט'], icon: 'coffee', title: 'הוצאות אוכל' },
  { keywords: ['קפה', 'בית קפה', 'בתי קפה'], icon: 'coffee', title: 'קפה ובתי קפה' },
  { keywords: ['קניות', 'שופינג', 'בגדים'], icon: 'cart', title: 'קניות' },
  { keywords: ['תחבורה', 'דלק', 'אוטו', 'רכב', 'מונית'], icon: 'car', title: 'תחבורה' },
  { keywords: ['חשמל', 'מים', 'ארנונה', 'חשבון', 'חשבונות'], icon: 'bolt', title: 'חשבונות שוטפים' },
  { keywords: ['חיסכון', 'יעד', 'יעדים'], icon: 'piggy', title: 'חיסכון', preferType: 'milestone' },
  { keywords: ['בילוי', 'בילויים', 'סרט', 'הופעה'], icon: 'sparkle', title: 'בילויים' },
  { keywords: ['בריאות', 'רופא', 'תרופות'], icon: 'heart', title: 'בריאות' },
  { keywords: ['מתנה', 'מתנות', 'יומולדת'], icon: 'gift', title: 'מתנות' },
  { keywords: ['נסיעה', 'נסיעות', 'טיול', 'חופשה'], icon: 'globe', title: 'נסיעות' },
  { keywords: ['טלפון', 'סלולרי', 'אינטרנט'], icon: 'phone', title: 'טלפון ותקשורת', preferType: 'budget' },
  { keywords: ['מנוי', 'מנויים', 'נטפליקס', 'ספוטיפיי'], icon: 'sparkle', title: 'מנויים', preferType: 'budget' },
  { keywords: ['רצף', 'שיא', 'ברציפות'], icon: 'target', title: 'שובר שיאים', preferType: 'streak' },
  { keywords: ['חריג', 'חריגה', 'חריגות'], icon: 'sparkle', title: 'עסקה חריגה', preferType: 'anomaly' },
]

const POS_SUBTITLES = [
  'ירידה של {v} לעומת החודש שעבר',
  'בקצב הנכון — תחת התקציב',
  'נראה מעולה ביחס לממוצע',
  'שליטה טובה השבוע',
  'יציב לעומת חודשים קודמים',
]

const NEG_SUBTITLES = [
  'עלייה של {v} — מעל התקציב',
  'גבוה מהממוצע — כדאי לבדוק',
  'חריגה קלה מהיעד החודשי',
  'חריג לעומת חודשים קודמים',
  'מעל הצפוי — שווה תשומת לב',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomPalette() {
  return pick(PALETTES)
}

function randomType(): InsightType {
  return pick<InsightType>(['trend', 'budget', 'streak', 'anomaly', 'milestone'])
}

/**
 * Mock AI insight generator. Reads the prompt for keywords to pick icon, title, and type
 * hint. Falls back to a random template if nothing matches. Returns an Insight after a
 * short delay to feel like a real LLM call.
 */
export function generateInsightFromPrompt(prompt: string): Promise<Insight> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = prompt.trim()
      const match = KEYWORD_MAP.find((e) => e.keywords.some((k) => lower.includes(k)))

      const positive = Math.random() > 0.45
      const change = Math.floor(Math.random() * 28) + 3
      const subtitleTmpl = positive ? pick(POS_SUBTITLES) : pick(NEG_SUBTITLES)
      const subtitle = subtitleTmpl.replace('{v}', `${change}%`)
      const palette = randomPalette()
      const icon = match?.icon || pick(['trend', 'sparkle', 'wallet', 'target'])
      const title = match?.title || (lower.length > 0 ? lower.slice(0, 24) : 'תובנה מותאמת')
      const id = `ai_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
      const type = match?.preferType || randomType()

      const base = {
        id, icon, title, subtitle,
        tint: palette.tint, ink: palette.ink, positive,
      }

      switch (type) {
        case 'trend': {
          const ins: TrendInsight = {
            ...base, type: 'trend',
            value: positive ? `-${change}%` : `+${change}%`,
            sparkline: genSparkline(positive ? 'down' : 'up'),
            delta: positive ? -change : change,
          }
          resolve(ins); return
        }
        case 'budget': {
          const total = [300, 500, 800, 1000, 1500][Math.floor(Math.random() * 5)]
          const ratio = positive ? 0.45 + Math.random() * 0.4 : 0.95 + Math.random() * 0.3
          const used = Math.round(total * ratio)
          const ins: BudgetInsight = {
            ...base, type: 'budget',
            value: `${Math.round((used / total) * 100)}%`,
            used, total,
          }
          resolve(ins); return
        }
        case 'anomaly': {
          const amount = 250 + Math.floor(Math.random() * 800)
          const ins: AnomalyInsight = {
            ...base, type: 'anomaly',
            value: `₪${amount}`,
            txTitle: 'רכישה חריגה', txAmount: amount,
            comparison: `פי ${(2 + Math.random() * 2.5).toFixed(1)} מהממוצע שלך`,
          }
          resolve(ins); return
        }
        case 'streak': {
          const count = 2 + Math.floor(Math.random() * 6)
          const ins: StreakInsight = {
            ...base, type: 'streak',
            value: String(count),
            count, unit: Math.random() > 0.5 ? 'שבועות' : 'ימים',
            context: 'של עמידה ביעד',
          }
          resolve(ins); return
        }
        case 'milestone': {
          const progress = 0.3 + Math.random() * 0.7
          const ins: MilestoneInsight = {
            ...base, type: 'milestone',
            value: `${Math.round(progress * 100)}%`,
            progress,
            caption: `₪${Math.floor(500 + Math.random() * 8000).toLocaleString()} בדרך`,
          }
          resolve(ins); return
        }
      }
    }, 900)
  })
}

export const DEFAULT_INSIGHTS: Insight[] = [
  INSIGHT_TEMPLATES[0], // trend: food
  INSIGHT_TEMPLATES[1], // budget: shop
  INSIGHT_TEMPLATES[3], // milestone: save
  INSIGHT_TEMPLATES[6], // streak: coffee
  INSIGHT_TEMPLATES[7], // anomaly: large purchase
  INSIGHT_TEMPLATES[5], // trend: transport
]
