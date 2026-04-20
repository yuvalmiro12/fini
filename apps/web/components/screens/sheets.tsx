'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiniMascot, FiniAvatar } from '../ui/fini-mascot'
import { CatIcon } from '../ui/cat-icon'
import { Icon } from '../ui/icon'
import { StatusBar } from '../ui/status-bar'
import { SHARED_BUDGET } from '../../lib/seed'
import { CATS } from '../../lib/cats'
import type { Transaction } from '../../lib/seed'

interface BaseProps { nav: (screen: string) => void }

interface TxDetailProps extends BaseProps {
  selectedTxId: string | null
  transactions: Transaction[]
  onDelete: (id: string) => void
  onUpdate: (tx: Transaction) => void
  prevScreen?: string
}

interface AddTxProps extends BaseProps {
  onSave: (tx: Transaction) => void
  prevScreen?: string
}

interface PaywallProps extends BaseProps {
  onSelectPlan: (plan: 'free' | 'pro' | 'proplus') => void
  currentPlan: 'free' | 'pro' | 'proplus'
}

// ── Category picker modal (inline) ───────────────────────────
const ALL_CATS = ['food', 'transport', 'shopping', 'health', 'home', 'entertainment', 'utilities', 'gifts', 'phone', 'travel', 'savings', 'income', 'other']

function CatPicker({ current, onPick, onClose }: { current: string; onPick: (cat: string) => void; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'absolute', inset: 0, background: 'rgba(31,26,21,0.5)', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}
    >
      <div onClick={e => e.stopPropagation()} style={{ background: '#FFFFFF', borderRadius: 20, padding: 20, width: '100%' }}>
        <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 16, fontWeight: 700, color: '#1F1A15', marginBottom: 16, textAlign: 'center' }}>בחר קטגוריה</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {ALL_CATS.map(cat => {
            const def = CATS[cat]
            if (!def) return null
            return (
              <button key={cat} onClick={() => onPick(cat)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: 8, borderRadius: 12, border: `2px solid ${current === cat ? '#C85A8A' : 'transparent'}`, background: current === cat ? 'rgba(200,90,138,0.08)' : 'rgba(31,26,21,0.03)', cursor: 'pointer' }}>
                <CatIcon cat={cat} size={36} radius={10} />
                <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 10, color: '#4A4237', textAlign: 'center' }}>{def.label}</span>
              </button>
            )
          })}
        </div>
        <button onClick={onClose} style={{ width: '100%', marginTop: 16, padding: '12px', borderRadius: 12, border: 'none', background: 'rgba(31,26,21,0.06)', cursor: 'pointer', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, color: '#4A4237' }}>ביטול</button>
      </div>
    </motion.div>
  )
}

// ── TxDetailSheet ────────────────────────────────────────────
export function TxDetailSheet({ nav, selectedTxId, transactions, onDelete, onUpdate, prevScreen = 'transactions' }: TxDetailProps) {
  const tx = transactions.find(t => t.id === selectedTxId) || transactions[0]
  const cat = CATS[tx?.category || 'other'] || CATS.other

  const [showCatPicker, setShowCatPicker] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [editDate, setEditDate] = useState(tx?.date || '')
  const [receiptAdded, setReceiptAdded] = useState(false)
  const [flagged, setFlagged] = useState(tx?.flagged || false)

  if (!tx) return null

  const handleCatPick = (newCat: string) => {
    onUpdate({ ...tx, category: newCat })
    setShowCatPicker(false)
  }

  const handleDateSave = (newDate: string) => {
    onUpdate({ ...tx, date: newDate })
    setShowDatePicker(false)
  }

  const handleFlag = () => {
    const newFlagged = !flagged
    setFlagged(newFlagged)
    onUpdate({ ...tx, flagged: newFlagged })
  }

  const handleDelete = () => {
    if (window.confirm('למחוק את העסקה הזו?')) onDelete(tx.id)
  }

  const currentCat = CATS[tx.category] || cat

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(31,26,21,0.5)', direction: 'rtl', justifyContent: 'flex-end', position: 'relative' }}>
      <div onClick={() => nav(prevScreen)} style={{ position: 'absolute', inset: 0, cursor: 'pointer' }} />

      {showCatPicker && (
        <CatPicker
          current={tx.category}
          onPick={handleCatPick}
          onClose={() => setShowCatPicker(false)}
        />
      )}

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 200 }}
        style={{ position: 'relative', background: '#FFFFFF', borderRadius: '24px 24px 0 0', padding: '0 20px 40px', zIndex: 10 }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(31,26,21,0.15)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 16px' }}>
          <CatIcon cat={tx.category} size={58} radius={16} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 28, fontWeight: 700, color: tx.type === 'income' ? '#5B8E6F' : '#D47070', marginBottom: 4 }}>
            {tx.type === 'income' ? '+' : '-'}₪{tx.amount.toLocaleString()}
          </div>
          <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 16, fontWeight: 600, color: '#1F1A15' }}>{tx.title}</div>
          <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#8A8070', marginTop: 2 }}>{tx.date} · {tx.time}</div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          {[
            currentCat.label,
            'כרטיס אשראי',
            flagged ? '🚩 מסומן' : 'לא מסומן',
            receiptAdded ? '📎 קבלה צורפה' : null,
          ].filter(Boolean).map((chip, i) => (
            <div key={i} style={{ padding: '5px 12px', borderRadius: 99, background: i === 0 ? currentCat.tint : i === 2 && flagged ? '#F3E7C7' : 'rgba(31,26,21,0.05)', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, fontWeight: 500, color: i === 0 ? currentCat.ink : i === 2 && flagged ? '#C9A24D' : '#4A4237' }}>
              {chip}
            </div>
          ))}
        </div>

        <div style={{ background: '#FDDDE8', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
          <FiniAvatar size={28} mood="happy" />
          <div>
            <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, fontWeight: 700, color: '#C85A8A', marginBottom: 2 }}>פיני אומר</div>
            <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#1F1A15', lineHeight: 1.5 }}>
              {tx.type === 'income'
                ? `הכנסה של ₪${tx.amount.toLocaleString()} — כל הכבוד! שקול להעביר חלק לחיסכון.`
                : `הוצאת ₪${tx.amount.toLocaleString()} על ${currentCat.label}. ${tx.amount > 200 ? 'זו הוצאה גדולה יחסית.' : 'נראה סביר.'}`}
            </div>
          </div>
        </div>

        {showDatePicker && (
          <div style={{ background: 'rgba(31,26,21,0.04)', borderRadius: 14, padding: '12px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="calendar" size={18} color="#5A6FB8" />
            <input
              type="date"
              value={editDate}
              onChange={e => setEditDate(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, color: '#1F1A15', outline: 'none' }}
            />
            <button onClick={() => handleDateSave(editDate)} style={{ background: '#5A6FB8', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13 }}>שמור</button>
            <button onClick={() => setShowDatePicker(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><Icon name="close" size={16} color="#8A8070" /></button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { icon: 'tag', label: 'שנה קטגוריה', action: () => setShowCatPicker(true) },
            { icon: 'calendar', label: showDatePicker ? 'סגור בחירת תאריך' : 'שנה תאריך', action: () => setShowDatePicker(v => !v) },
            { icon: 'receipt', label: receiptAdded ? 'קבלה צורפה ✓' : 'הוסף קבלה', action: () => setReceiptAdded(true) },
            { icon: 'bell', label: flagged ? 'הסר סימון' : 'סמן לבדיקה', action: handleFlag },
            { icon: 'close', label: 'מחק עסקה', action: handleDelete, color: '#D47070' },
          ].map((action, i) => (
            <button key={i} onClick={action.action} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 4px', background: 'transparent', border: 'none', borderBottom: i < 4 ? '1px solid rgba(31,26,21,0.05)' : 'none', cursor: 'pointer', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, color: action.color || '#1F1A15', direction: 'rtl', width: '100%', textAlign: 'right' }}>
              <Icon name={action.icon} size={18} color={action.color || '#4A4237'} />
              {action.label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ── AddTx ────────────────────────────────────────────────────
const ADD_CATS = ['food', 'transport', 'shopping', 'health', 'home', 'entertainment', 'utilities', 'gifts', 'phone', 'other']

export function AddTx({ nav, onSave, prevScreen = 'chat' }: AddTxProps) {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [selectedCat, setSelectedCat] = useState('food')
  const [desc, setDesc] = useState('')
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [showDateInput, setShowDateInput] = useState(false)
  const [error, setError] = useState('')

  const handleSave = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('יש להזין סכום תקין')
      return
    }
    const newTx: Transaction = {
      id: `t${Date.now()}`,
      title: desc.trim() || (CATS[selectedCat]?.label || selectedCat),
      category: type === 'income' ? 'income' : selectedCat,
      amount: Number(amount),
      type,
      date,
      time: new Date().toTimeString().slice(0, 5),
      flagged: false,
    }
    onSave(newTx)
    nav('transactions')
  }

  const displayDate = date === today ? 'היום' : date

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#FDDDE8', direction: 'rtl', overflow: 'hidden' }}>
      <StatusBar />
      <div style={{ padding: '4px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => nav(prevScreen)} style={{ background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: 12, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#1F1A15' }}>
          <Icon name="close" size={16} color="#1F1A15" />
          ביטול
        </button>
        <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 16, fontWeight: 700, color: '#1F1A15' }}>הוסף עסקה</span>
        <button onClick={handleSave} style={{ background: '#C85A8A', border: 'none', borderRadius: 12, padding: '8px 14px', cursor: 'pointer', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>
          שמור
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 40px' }}>
        <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 14, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <FiniAvatar size={24} mood="talk" />
          <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, color: '#4A4237' }}>ספר לי על עסקה חדשה</span>
        </div>

        {error && (
          <div style={{ background: '#FADEDC', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#D47070' }}>{error}</div>
        )}

        {/* Type toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.6)', borderRadius: 14, padding: 4, marginBottom: 20 }}>
          {(['expense', 'income'] as const).map(t => (
            <button key={t} onClick={() => { setType(t); setError('') }} style={{ flex: 1, padding: '10px', borderRadius: 11, border: 'none', background: type === t ? '#FFFFFF' : 'transparent', cursor: 'pointer', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 600, color: type === t ? (t === 'expense' ? '#D47070' : '#5B8E6F') : '#8A8070', boxShadow: type === t ? '0 2px 8px rgba(31,26,21,0.08)' : 'none', transition: 'all 0.2s ease' }}>
              {t === 'expense' ? 'הוצאה' : 'הכנסה'}
            </button>
          ))}
        </div>

        {/* Amount hero */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 32, fontWeight: 600, color: type === 'expense' ? '#D47070' : '#5B8E6F' }}>₪</span>
            <input
              type="number"
              value={amount}
              onChange={e => { setAmount(e.target.value); setError('') }}
              placeholder="0"
              autoFocus
              style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 56, fontWeight: 700, color: type === 'expense' ? '#D47070' : '#5B8E6F', border: 'none', background: 'transparent', outline: 'none', width: 200, textAlign: 'center' }}
            />
          </div>
          {error && <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, color: '#D47070', marginTop: 4 }}>{error}</div>}
        </div>

        {/* Category grid */}
        {type === 'expense' && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, fontWeight: 600, color: '#4A4237', marginBottom: 10 }}>קטגוריה</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
              {ADD_CATS.map(cat => {
                const def = CATS[cat]
                const isSelected = selectedCat === cat
                return (
                  <button key={cat} onClick={() => setSelectedCat(cat)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 4px', borderRadius: 12, border: `2px solid ${isSelected ? '#C85A8A' : 'transparent'}`, background: isSelected ? 'rgba(200,90,138,0.1)' : 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                    <CatIcon cat={cat} size={32} radius={8} />
                    <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 9, color: '#4A4237', textAlign: 'center' }}>{def?.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Description */}
        <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <Icon name="receipt" size={18} color="#8A8070" />
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="שם העסקה / תיאור" style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, color: '#1F1A15', outline: 'none', direction: 'rtl' }} />
        </div>

        {/* Date */}
        <div
          onClick={() => setShowDateInput(v => !v)}
          style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <Icon name="calendar" size={18} color="#8A8070" />
          <span style={{ flex: 1, fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, color: '#4A4237' }}>{displayDate}</span>
          <Icon name="arrow" size={16} color="#8A8070" />
        </div>
        {showDateInput && (
          <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.5)', borderRadius: '0 0 14px 14px', marginTop: -6 }}>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, color: '#1F1A15', outline: 'none' }} />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Paywall ───────────────────────────────────────────────────
const FEATURES = [
  { icon: 'sparkle', text: 'תובנות AI מתקדמות' },
  { icon: 'target',  text: 'מטרות חיסכון מרובות' },
  { icon: 'users',   text: 'תקציב משותף עם בן/בת זוג' },
  { icon: 'trend',   text: 'דוחות ותחזיות פיננסיות' },
  { icon: 'bell',    text: 'התראות חכמות בזמן אמת' },
  { icon: 'lock',    text: 'גיבוי מאובטח בענן' },
]

const PLANS_DATA = [
  { id: 'pro'    as const, name: 'Pro',  price: '₪29', period: '/חודש', highlight: true,  badge: 'פופולרי' },
  { id: 'proplus'as const, name: 'Pro+', price: '₪59', period: '/חודש', highlight: false, badge: null },
]

export function Paywall({ nav, onSelectPlan, currentPlan }: PaywallProps) {
  const [selected, setSelected] = useState<'pro' | 'proplus'>('pro')

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'linear-gradient(160deg, #FDDDE8 0%, #F7F5E8 60%)', direction: 'rtl', overflow: 'hidden' }}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <FiniMascot size={120} mood="wave" />
            <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', background: '#C9A24D', color: '#FFFFFF', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>PRO</div>
          </div>
          <h2 style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 26, fontWeight: 700, color: '#1F1A15', margin: '16px 0 8px' }}>שדרג לפיני Pro</h2>
          <p style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, color: '#4A4237', margin: 0, lineHeight: 1.6 }}>14 ימי ניסיון חינמי, ללא כרטיס אשראי</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#DDEEDF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={f.icon} size={16} color="#5B8E6F" />
              </div>
              <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, color: '#1F1A15' }}>{f.text}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          {PLANS_DATA.map(plan => (
            <div
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              style={{ flex: 1, background: selected === plan.id ? '#1F1A15' : 'rgba(255,255,255,0.7)', borderRadius: 18, padding: '16px 14px', position: 'relative', border: selected === plan.id ? '2px solid #C85A8A' : '1.5px solid rgba(31,26,21,0.1)', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              {plan.badge && (
                <div style={{ position: 'absolute', top: -10, right: 14, background: '#C85A8A', color: '#FFFFFF', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99 }}>{plan.badge}</div>
              )}
              <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 16, fontWeight: 700, color: selected === plan.id ? '#F7F5E8' : '#1F1A15', marginBottom: 4 }}>{plan.name}</div>
              <div>
                <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 26, fontWeight: 700, color: selected === plan.id ? '#C85A8A' : '#4A4237' }}>{plan.price}</span>
                <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#8A8070' }}>{plan.period}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => onSelectPlan(selected)}
          style={{ width: '100%', height: 56, borderRadius: 16, background: '#1F1A15', border: 'none', cursor: 'pointer', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 16, fontWeight: 600, color: '#F7F5E8', marginBottom: 12 }}
        >
          התחל ניסיון חינמי — {selected === 'pro' ? '₪29' : '₪59'}/חודש
        </button>
        <button
          onClick={() => onSelectPlan('free')}
          style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#8A8070', padding: '8px' }}
        >
          המשך בחינם
        </button>
      </div>
    </div>
  )
}

// ── Couples ───────────────────────────────────────────────────
export function Couples({ nav }: BaseProps) {
  const budget = SHARED_BUDGET
  const spentPct = Math.round((budget.spent / budget.total) * 100)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteSent, setInviteSent] = useState(false)

  const handleInvite = () => {
    if (inviteEmail.includes('@')) {
      setInviteSent(true)
      setInviteEmail('')
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#E8ECFF', direction: 'rtl', overflow: 'hidden' }}>
      <StatusBar />
      <div style={{ padding: '4px 16px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => nav('data')} style={{ background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: 12, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#1F1A15' }}>
          <Icon name="arrowL" size={16} color="#1F1A15" />
          חזור
        </button>
        <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 18, fontWeight: 700, color: '#1F1A15' }}>תקציב משותף</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 40px' }}>
        {/* Avatars */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ position: 'relative', height: 64, width: 96 }}>
            {budget.members.map((m, i) => (
              <div key={i} style={{ position: 'absolute', right: i * 36, width: 56, height: 56, borderRadius: '50%', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #E8ECFF', boxShadow: '0 2px 8px rgba(31,26,21,0.12)' }}>
                <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 22, fontWeight: 700, color: '#FFFFFF' }}>{m.initial}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          {budget.members.map((m, i) => (
            <span key={i} style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 15, fontWeight: 600, color: m.color }}>
              {m.name}{i < budget.members.length - 1 ? ' & ' : ''}
            </span>
          ))}
        </div>

        {/* Budget progress */}
        <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 18, padding: 18, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 600, color: '#1F1A15' }}>תקציב חודשי</span>
            <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 700, color: '#4A4237' }}>₪{budget.spent.toLocaleString()} / ₪{budget.total.toLocaleString()}</span>
          </div>
          <div style={{ background: 'rgba(31,26,21,0.08)', borderRadius: 99, height: 10, position: 'relative', marginBottom: 8 }}>
            <div style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: `${spentPct}%`, background: spentPct > 80 ? '#D47070' : '#5A6FB8', borderRadius: 99, transition: 'width 0.6s ease' }} />
          </div>
          <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, color: '#8A8070' }}>{spentPct}% מהתקציב</span>
        </div>

        {/* Transactions */}
        <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 18, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ padding: '14px 16px 8px', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 700, color: '#1F1A15' }}>עסקאות משותפות</div>
          {budget.transactions.map(tx => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderTop: '1px solid rgba(31,26,21,0.05)' }}>
              <CatIcon cat={tx.category} size={36} radius={10} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, fontWeight: 500, color: '#1F1A15' }}>{tx.title}</div>
                <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 11, color: '#8A8070' }}>{tx.date}</div>
              </div>
              <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 700, color: '#D47070' }}>-₪{tx.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Invite */}
        <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 18, padding: 16, marginBottom: 14 }}>
          <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 700, color: '#1F1A15', marginBottom: 10 }}>הזמן בן/בת זוג</div>
          {inviteSent ? (
            <div style={{ background: '#DDEEDF', borderRadius: 12, padding: '12px 14px', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#5B8E6F', textAlign: 'center' }}>
              ✓ הזמנה נשלחה בהצלחה!
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="כתובת אימייל..."
                style={{ flex: 1, background: 'rgba(31,26,21,0.05)', border: 'none', borderRadius: 10, padding: '10px 12px', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#1F1A15', outline: 'none', direction: 'rtl' }}
              />
              <button onClick={handleInvite} style={{ background: '#5A6FB8', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 14px', cursor: 'pointer', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
                שלח
              </button>
            </div>
          )}
        </div>

        {/* Fini tip */}
        <div style={{ background: '#FDDDE8', borderRadius: 16, padding: '14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <FiniAvatar size={28} mood="happy" />
          <div>
            <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, fontWeight: 700, color: '#C85A8A', marginBottom: 2 }}>טיפ מפיני</div>
            <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, color: '#1F1A15', lineHeight: 1.5 }}>הוצאות הבית שלכם גבוהות ב-12% לעומת החודש שעבר. כדאי לבדוק את חשבון החשמל!</div>
          </div>
        </div>
      </div>
    </div>
  )
}
