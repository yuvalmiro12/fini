export interface CatDef {
  label: string
  icon: string
  tint: string
  ink: string
}

export const CATS: Record<string, CatDef> = {
  food: { label: 'אוכל', icon: 'coffee', tint: '#F3E7C7', ink: '#C9A24D' },
  transport: { label: 'תחבורה', icon: 'car', tint: '#D4DBFA', ink: '#5A6FB8' },
  shopping: { label: 'קניות', icon: 'cart', tint: '#FDDDE8', ink: '#C85A8A' },
  health: { label: 'בריאות', icon: 'heart', tint: '#FADEDC', ink: '#D47070' },
  home: { label: 'בית', icon: 'home', tint: '#D6EEE0', ink: '#5B8E6F' },
  entertainment: { label: 'בידור', icon: 'sparkle', tint: '#E8ECFF', ink: '#5A6FB8' },
  utilities: { label: 'חשבונות', icon: 'bolt', tint: '#F3E7C7', ink: '#C9A24D' },
  income: { label: 'הכנסה', icon: 'wallet', tint: '#DDEEDF', ink: '#5B8E6F' },
  savings: { label: 'חיסכון', icon: 'piggy', tint: '#BEE3CB', ink: '#5B8E6F' },
  gifts: { label: 'מתנות', icon: 'gift', tint: '#FDDDE8', ink: '#C85A8A' },
  phone: { label: 'סלולר', icon: 'phone', tint: '#E8ECFF', ink: '#5A6FB8' },
  travel: { label: 'נסיעות', icon: 'globe', tint: '#D4DBFA', ink: '#5A6FB8' },
  other: { label: 'אחר', icon: 'dots', tint: '#EFEADA', ink: '#8A8070' },
}
