/**
 * Insight templates + mock AI generator for the Insights desktop screen.
 * Each template is a reusable "insight card" the user can drop into their dashboard.
 */

export interface Insight {
  id: string
  icon: string
  title: string
  subtitle: string
  tint: string
  ink: string
  value: string
  positive: boolean
}

// Color palettes we can pick from for new insights
const PALETTES = [
  { tint: '#D6EEE0', ink: '#5B8E6F' }, // green
  { tint: '#FADEDC', ink: '#D47070' }, // red
  { tint: '#F3E7C7', ink: '#C9A24D' }, // yellow
  { tint: '#D4DBFA', ink: '#5A6FB8' }, // blue
  { tint: '#FDDDE8', ink: '#C85A8A' }, // pink
  { tint: '#E8DCFF', ink: '#7B5AB8' }, // purple
]

export const INSIGHT_TEMPLATES: Insight[] = [
  { id: 'tmpl_food',    icon: 'coffee',  title: 'הוצאות אוכל',     subtitle: 'ירדו ב-8% מהחודש שעבר',     tint: '#D6EEE0', ink: '#5B8E6F', value: '-8%',   positive: true  },
  { id: 'tmpl_shop',    icon: 'cart',    title: 'קניות',           subtitle: 'עלו ב-15% — מעל התקציב',    tint: '#FADEDC', ink: '#D47070', value: '+15%',  positive: false },
  { id: 'tmpl_bills',   icon: 'bolt',    title: 'חשבונות',         subtitle: 'גבוה ב-23% מהממוצע',        tint: '#F3E7C7', ink: '#C9A24D', value: '+23%',  positive: false },
  { id: 'tmpl_save',    icon: 'piggy',   title: 'חיסכון',          subtitle: 'על המסלול לעמוד ביעד!',     tint: '#D4DBFA', ink: '#5A6FB8', value: '56%',   positive: true  },
  { id: 'tmpl_coffee',  icon: 'coffee',  title: 'קפה ובתי קפה',    subtitle: '₪420 החודש, דומה לממוצע',   tint: '#F3E7C7', ink: '#C9A24D', value: '₪420',  positive: true  },
  { id: 'tmpl_trans',   icon: 'car',     title: 'תחבורה',          subtitle: 'ירידה של 12% — עבודה מהבית', tint: '#D4DBFA', ink: '#5A6FB8', value: '-12%', positive: true  },
  { id: 'tmpl_ent',     icon: 'sparkle', title: 'בילויים',         subtitle: 'קצת מעל התקציב החודשי',     tint: '#FDDDE8', ink: '#C85A8A', value: '+7%',   positive: false },
  { id: 'tmpl_health',  icon: 'heart',   title: 'בריאות',          subtitle: 'הוצאות יציבות החודש',       tint: '#D6EEE0', ink: '#5B8E6F', value: '₪180',  positive: true  },
  { id: 'tmpl_gifts',   icon: 'gift',    title: 'מתנות',           subtitle: 'גבוה מהחודש הקודם',         tint: '#FDDDE8', ink: '#C85A8A', value: '+22%',  positive: false },
  { id: 'tmpl_travel',  icon: 'globe',   title: 'נסיעות',          subtitle: 'ללא הוצאות החודש',          tint: '#D4DBFA', ink: '#5A6FB8', value: '₪0',    positive: true  },
  { id: 'tmpl_phone',   icon: 'phone',   title: 'טלפון ותקשורת',   subtitle: 'זהה לממוצע החודשי',         tint: '#E8DCFF', ink: '#7B5AB8', value: '₪149',  positive: true  },
  { id: 'tmpl_subs',    icon: 'sparkle', title: 'מנויים',          subtitle: '8 מנויים פעילים',           tint: '#F3E7C7', ink: '#C9A24D', value: '₪240',  positive: false },
]

// Simple keyword → template mapping for the mock AI generator
const KEYWORD_MAP: Array<{ keywords: string[]; template: Partial<Insight> }> = [
  { keywords: ['אוכל', 'מסעדה', 'מסעדות', 'סופר', 'סופרמרקט'],
    template: { icon: 'coffee', title: 'הוצאות אוכל' } },
  { keywords: ['קפה', 'בית קפה', 'בתי קפה'],
    template: { icon: 'coffee', title: 'קפה ובתי קפה' } },
  { keywords: ['קניות', 'שופינג', 'בגדים'],
    template: { icon: 'cart', title: 'קניות' } },
  { keywords: ['תחבורה', 'דלק', 'אוטו', 'רכב', 'מונית'],
    template: { icon: 'car', title: 'תחבורה' } },
  { keywords: ['חשמל', 'מים', 'ארנונה', 'חשבון', 'חשבונות'],
    template: { icon: 'bolt', title: 'חשבונות שוטפים' } },
  { keywords: ['חיסכון', 'יעד', 'יעדים'],
    template: { icon: 'piggy', title: 'חיסכון' } },
  { keywords: ['בילוי', 'בילויים', 'סרט', 'הופעה'],
    template: { icon: 'sparkle', title: 'בילויים' } },
  { keywords: ['בריאות', 'רופא', 'תרופות'],
    template: { icon: 'heart', title: 'בריאות' } },
  { keywords: ['מתנה', 'מתנות', 'יומולדת'],
    template: { icon: 'gift', title: 'מתנות' } },
  { keywords: ['נסיעה', 'נסיעות', 'טיול', 'חופשה'],
    template: { icon: 'globe', title: 'נסיעות' } },
  { keywords: ['טלפון', 'סלולרי', 'אינטרנט'],
    template: { icon: 'phone', title: 'טלפון ותקשורת' } },
  { keywords: ['מנוי', 'מנויים', 'נטפליקס', 'ספוטיפיי'],
    template: { icon: 'sparkle', title: 'מנויים' } },
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

/**
 * Mock AI insight generator. Reads the prompt for keywords to pick icon + title;
 * falls back to a random template if nothing matches. Returns an Insight after a
 * short delay to feel like a real LLM call.
 */
export function generateInsightFromPrompt(prompt: string): Promise<Insight> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = prompt.trim()
      const match = KEYWORD_MAP.find((e) => e.keywords.some((k) => lower.includes(k)))

      const positive = Math.random() > 0.45
      const change = Math.floor(Math.random() * 28) + 3
      const value = positive
        ? (Math.random() > 0.5 ? `-${change}%` : `₪${100 + Math.floor(Math.random() * 500)}`)
        : `+${change}%`
      const subtitleTmpl = positive ? pick(POS_SUBTITLES) : pick(NEG_SUBTITLES)
      const subtitle = subtitleTmpl.replace('{v}', `${change}%`)
      const palette = match && match.template.icon
        ? PALETTES.find((p) => p.ink === '#5B8E6F')!
        : randomPalette()

      resolve({
        id: `ai_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        icon: match?.template.icon || pick(['trend', 'sparkle', 'wallet', 'target']),
        title: match?.template.title || (lower.length > 0 ? lower.slice(0, 24) : 'תובנה מותאמת'),
        subtitle,
        tint: palette.tint,
        ink: palette.ink,
        value,
        positive,
      })
    }, 900)
  })
}

export const DEFAULT_INSIGHTS: Insight[] = [
  INSIGHT_TEMPLATES[0], // food
  INSIGHT_TEMPLATES[1], // shop
  INSIGHT_TEMPLATES[2], // bills
  INSIGHT_TEMPLATES[3], // save
  INSIGHT_TEMPLATES[4], // coffee
  INSIGHT_TEMPLATES[5], // trans
]
