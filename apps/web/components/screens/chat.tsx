'use client'
import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiniAvatar } from '../ui/fini-mascot'
import { CatIcon } from '../ui/cat-icon'
import { Icon } from '../ui/icon'
import { TabBar } from '../ui/tab-bar'
import { StatusBar } from '../ui/status-bar'
import { CHAT_MESSAGES } from '../../lib/seed'
import type { Transaction, ChatMessage } from '../../lib/seed'

interface ScreenProps {
  nav: (screen: string) => void
  transactions: Transaction[]
  userName?: string
}

// ── Mock AI engine ────────────────────────────────────────────
export function getAiResponse(text: string, transactions: Transaction[]): ChatMessage[] {
  const lower = text.toLowerCase()
  const id = () => `ai${Date.now()}${Math.random().toString(36).slice(2, 6)}`

  const expenses = transactions.filter(t => t.type === 'expense')
  const incomes  = transactions.filter(t => t.type === 'income')
  const totalExp = expenses.reduce((s, t) => s + t.amount, 0)
  const totalInc = incomes.reduce((s, t) => s + t.amount, 0)
  const balance  = totalInc - totalExp
  const maxExp   = [...expenses].sort((a, b) => b.amount - a.amount)[0]

  // --- expense queries ---
  if (lower.includes('כמה הוצאתי') || (lower.includes('הוצאות') && !lower.includes('קטגורי'))) {
    const bars = [45, 60, 80, 55, 90, 70, Math.min(100, totalExp / 150)]
    return [
      { id: id(), role: 'fini', type: 'insight', insight: { title: 'הוצאות החודש', body: `הוצאת **₪${totalExp.toLocaleString()}** החודש. המוביל הוא **אוכל** עם 28% מסך ההוצאות.`, bars, days: ['א','ב','ג','ד','ה','ו','ש'] } },
      { id: id(), role: 'fini', type: 'suggestions', suggestions: ['ראה פירוט קטגוריות', 'השווה לחודש שעבר', 'טיפים לחיסכון'] },
    ]
  }

  // --- income queries ---
  if (lower.includes('הכנסה') || lower.includes('כמה הרווחתי')) {
    return [{ id: id(), role: 'fini', type: 'text', text: `הכנסות החודש: **₪${totalInc.toLocaleString()}**. המשכורת העיקרית + ₪${(totalInc - 12400).toLocaleString()} נוספים.` }]
  }

  // --- balance queries ---
  if (lower.includes('נשאר') || lower.includes('יתרה') || lower.includes('כמה יש לי')) {
    return [{ id: id(), role: 'fini', type: 'text', text: `נשאר לך **₪${balance.toLocaleString()}** החודש. הכנסות: ₪${totalInc.toLocaleString()} · הוצאות: ₪${totalExp.toLocaleString()}.` }]
  }

  // --- biggest expense ---
  if ((lower.includes('הוצאה') && (lower.includes('גדולה') || lower.includes('כי'))) || lower.includes('הכי יקר')) {
    if (maxExp) return [
      { id: id(), role: 'fini', type: 'text', text: 'ההוצאה הגדולה ביותר שלך:' },
      { id: id(), role: 'fini', type: 'txChip', txId: maxExp.id },
    ]
  }

  // --- savings ---
  if (lower.includes('חיסכון') || lower.includes('לחסוך') || lower.includes('יעד')) {
    return [{ id: id(), role: 'fini', type: 'text', text: 'את על המסלול! 🎯 חסכת כבר **₪8,400** מתוך יעד ₪15,000 — 56% מהדרך. בקצב הזה תגיעי ליעד בעוד ~3 חודשים.' }]
  }

  // --- category analysis ---
  if (lower.includes('קטגוריה') || lower.includes('אוכל') || lower.includes('קניות') || lower.includes('תחבורה')) {
    const bars = [28, 24, 18, 16, 8, 6]
    return [
      { id: id(), role: 'fini', type: 'insight', insight: { title: 'פירוט קטגוריות', body: '**אוכל** 28% · **קניות** 24% · **חשבונות** 18% · **תחבורה** 16% · **בידור** 8%', bars, days: ['🍕','🛍️','⚡','🚗','🎬','➕'] } },
    ]
  }

  // --- tips ---
  if (lower.includes('טיפ') || lower.includes('לחסוך') || lower.includes('איך')) {
    return [{ id: id(), role: 'fini', type: 'text', text: '3 טיפים שיעזרו לך החודש:\n1️⃣ תכנני קניות מראש — חוסכת עד 20% על אוכל\n2️⃣ בדקי את החשבונות — חשמל גבוה ב-23% מהממוצע\n3️⃣ הגדרי תזכורת חיסכון ב-1 לחודש' }]
  }

  // --- comparison ---
  if (lower.includes('חודש שעבר') || lower.includes('השווה')) {
    return [{ id: id(), role: 'fini', type: 'insight', insight: { title: 'השוואה חודשית', body: 'החודש הוצאת **₪13,780** לעומת **₪12,340** בחודש שעבר — **+11.7%**.', bars: [70, 75, 65, 80, 85, 90, Math.min(100, totalExp / 150)], days: ['ספ','אוק','נוב','דצ','ינ','פב','מר'] } }]
  }

  // --- add transaction ---
  if (lower.includes('הוסף') || lower.includes('תוסיף') || lower.includes('רשום הוצאה')) {
    return [{ id: id(), role: 'fini', type: 'text', text: 'בטח! לחצי על ➕ למטה כדי להוסיף הוצאה חדשה.' }]
  }

  // --- greeting ---
  if (lower.includes('שלום') || lower.includes('היי') || lower.includes('בוקר') || lower.includes('ערב')) {
    return [{ id: id(), role: 'fini', type: 'text', text: 'שלום! 😊 שמחה לראות אותך. מה נבדוק היום — הוצאות, הכנסות, חיסכון?' }]
  }

  // --- default ---
  return [
    { id: id(), role: 'fini', type: 'text', text: 'מבינה! אני יכולה לעזור לך עם ניהול הוצאות, חיסכון, ניתוח קטגוריות ועוד. מה מעניין אותך?' },
    { id: id(), role: 'fini', type: 'suggestions', suggestions: ['כמה הוצאתי?', 'מה נשאר לי?', 'הוצאה הכי גדולה'] },
  ]
}

// ── Sub-components ──────────────────────────────────────────

function ChatHeader({ nav }: { nav: (s: string) => void }) {
  return (
    <div style={{ padding: '0 20px 12px', display: 'flex', alignItems: 'center', gap: 10, direction: 'rtl', borderBottom: '1px solid rgba(31,26,21,0.06)' }}>
      <div style={{ position: 'relative' }}>
        <FiniAvatar size={44} mood="happy" />
        <div style={{ position: 'absolute', bottom: 1, left: 1, width: 10, height: 10, borderRadius: '50%', background: '#5B8E6F', border: '2px solid #FDDDE8' }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 16, fontWeight: 700, color: '#1F1A15' }}>פיני</div>
        <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, color: '#5B8E6F', fontWeight: 500 }}>מחובר · מוכן לעזור</div>
      </div>
      <button onClick={() => nav('data')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6 }}>
        <Icon name="insights" size={22} color="#8A8070" />
      </button>
      <button onClick={() => nav('settings')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6 }}>
        <Icon name="settings" size={22} color="#8A8070" />
      </button>
    </div>
  )
}

function DateDivider({ date }: { date: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(31,26,21,0.08)' }} />
      <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, color: '#8A8070', fontWeight: 500 }}>{date}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(31,26,21,0.08)' }} />
    </div>
  )
}

function TxChip({ txId, transactions }: { txId: string; transactions: Transaction[] }) {
  const tx = transactions.find(t => t.id === txId)
  if (!tx) return null
  return (
    <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, direction: 'rtl', boxShadow: '0 2px 8px rgba(31,26,21,0.08)', maxWidth: 260 }}>
      <CatIcon cat={tx.category} size={38} radius={10} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, fontWeight: 600, color: '#1F1A15' }}>{tx.title}</div>
        <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, color: '#8A8070' }}>{tx.time}</div>
      </div>
      <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 15, fontWeight: 700, color: '#D47070' }}>₪{tx.amount.toLocaleString()}</div>
    </div>
  )
}

function InsightCard({ data }: { data: { title: string; body: string; bars: number[]; days: string[] } }) {
  const maxBar = Math.max(...data.bars)
  return (
    <div style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FDDDE8 100%)', borderRadius: 18, padding: '16px', maxWidth: 280, boxShadow: '0 4px 16px rgba(31,26,21,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <Icon name="sparkle" size={14} color="#C9A24D" />
        <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, fontWeight: 700, color: '#C9A24D' }}>תובנה</span>
      </div>
      <p style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, color: '#1F1A15', lineHeight: 1.6, margin: '0 0 14px', whiteSpace: 'pre-line' }}
        dangerouslySetInnerHTML={{ __html: data.body.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 40 }}>
        {data.bars.map((val, i) => {
          const isLast = i === data.bars.length - 1
          const height = Math.max(4, (val / maxBar) * 36)
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1 }}>
              <div style={{ width: '100%', height, borderRadius: 3, background: isLast ? '#C85A8A' : '#F9C6D7', transition: 'height 0.4s ease' }} />
              <span style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 9, color: '#8A8070' }}>{data.days[i]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Daily Brief ────────────────────────────────────────────────

function DailyBrief({ transactions, userName, onAsk }: { transactions: Transaction[]; userName: string; onAsk: (q: string) => void }) {
  const [expanded, setExpanded] = useState(true)

  // Latest transaction date = "today" in the data
  const dates = transactions.map(t => t.date).sort().reverse()
  const today = dates[0]
  const todayTxs = transactions.filter(t => t.date === today && t.type === 'expense')
  const todaySpent = todayTxs.reduce((s, t) => s + t.amount, 0)
  const biggest = [...todayTxs].sort((a, b) => b.amount - a.amount)[0]

  // Previous day comparison
  const uniqueDays = Array.from(new Set(dates))
  const prevDay = uniqueDays[1]
  const prevTxs = transactions.filter(t => t.date === prevDay && t.type === 'expense')
  const prevSpent = prevTxs.reduce((s, t) => s + t.amount, 0)
  const delta = prevSpent > 0 ? Math.round(((todaySpent - prevSpent) / prevSpent) * 100) : 0
  const deltaPositive = delta > 0

  // Hebrew day name
  const dayFmt = new Intl.DateTimeFormat('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })
  let dateLabel = 'היום'
  try {
    if (today) dateLabel = dayFmt.format(new Date(today))
  } catch {}

  const quickQs = ['כמה הוצאתי היום?', 'מה ההוצאה הגדולה שלי?', 'מה נשאר לי החודש?']

  const greetHour = new Date().getHours()
  const greet = greetHour < 12 ? 'בוקר טוב' : greetHour < 18 ? 'צהריים טובים' : 'ערב טוב'

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(253,221,232,0.55) 100%)',
        borderRadius: 18,
        padding: expanded ? '14px 16px 16px' : '12px 16px',
        boxShadow: '0 4px 16px rgba(31,26,21,0.08)',
        border: '1.5px solid rgba(200,90,138,0.15)',
        direction: 'rtl',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <FiniAvatar size={34} mood="happy" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, fontWeight: 700, color: '#1F1A15' }}>
            {greet}, {userName} ✨
          </div>
          <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 11, color: '#8A8070' }}>
            הסיכום של {dateLabel}
          </div>
        </div>
        <button
          onClick={() => setExpanded(e => !e)}
          aria-label={expanded ? 'מזער' : 'הרחב'}
          style={{
            background: 'rgba(200,90,138,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: 28,
            height: 28,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
          }}
        >
          <Icon name="chevron-down" size={14} color="#C85A8A" />
        </button>
      </div>

      {expanded && (
        <>
          {/* Stats row */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <div style={{ flex: 1.2, background: 'rgba(255,255,255,0.9)', borderRadius: 12, padding: '10px 12px' }}>
              <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 10, color: '#8A8070', fontWeight: 500, marginBottom: 2 }}>הוצאות</div>
              <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 17, fontWeight: 700, color: '#1F1A15', lineHeight: 1.1 }}>
                ₪{todaySpent.toLocaleString()}
              </div>
              <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 10, color: '#8A8070', marginTop: 2 }}>
                {todayTxs.length} {todayTxs.length === 1 ? 'עסקה' : 'עסקאות'}
              </div>
            </div>

            <div style={{ flex: 1, background: 'rgba(255,255,255,0.9)', borderRadius: 12, padding: '10px 12px' }}>
              <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 10, color: '#8A8070', fontWeight: 500, marginBottom: 2 }}>מול אתמול</div>
              <div
                style={{
                  fontFamily: "'Rubik', system-ui, sans-serif",
                  fontSize: 17,
                  fontWeight: 700,
                  color: deltaPositive ? '#D47070' : '#5B8E6F',
                  lineHeight: 1.1,
                }}
              >
                {deltaPositive ? '+' : ''}{delta}%
              </div>
              <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 10, color: '#8A8070', marginTop: 2 }}>
                ₪{prevSpent.toLocaleString()} אתמול
              </div>
            </div>
          </div>

          {/* Insight line */}
          {biggest && (
            <div
              style={{
                marginTop: 10,
                padding: '8px 12px',
                background: 'rgba(200,90,138,0.08)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Icon name="sparkle" size={13} color="#C9A24D" />
              <div style={{ fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 12, color: '#1F1A15', lineHeight: 1.4, flex: 1 }}>
                הגדולה היום: <strong>{biggest.title}</strong> · ₪{biggest.amount.toLocaleString()}
              </div>
            </div>
          )}

          {todayTxs.length === 0 && (
            <div
              style={{
                marginTop: 10,
                padding: '8px 12px',
                background: 'rgba(91,142,111,0.1)',
                borderRadius: 12,
                fontFamily: "'Rubik', system-ui, sans-serif",
                fontSize: 12,
                color: '#1F1A15',
                lineHeight: 1.4,
              }}
            >
              ✨ יום נקי — עדיין לא נרשמו הוצאות היום.
            </div>
          )}

          {/* Quick questions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {quickQs.map((q, i) => (
              <button
                key={i}
                onClick={() => onAsk(q)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 99,
                  border: '1px solid rgba(200,90,138,0.3)',
                  background: 'rgba(255,255,255,0.8)',
                  fontFamily: "'Rubik', system-ui, sans-serif",
                  fontSize: 11,
                  fontWeight: 500,
                  color: '#C85A8A',
                  cursor: 'pointer',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}

export function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, direction: 'rtl' }}>
      <FiniAvatar size={32} mood="talk" />
      <div style={{ background: '#FFFFFF', borderRadius: '20px 20px 20px 6px', padding: '12px 16px', boxShadow: '0 2px 8px rgba(31,26,21,0.06)', display: 'flex', alignItems: 'center', gap: 4 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#C85A8A', opacity: 0.7, animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
        ))}
        <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
      </div>
    </div>
  )
}

export function SuggChips({ suggestions, onSelect }: { suggestions: string[]; onSelect: (s: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, direction: 'rtl', paddingRight: 40 }}>
      {suggestions.map((s, i) => (
        <button key={i} onClick={() => onSelect(s)} style={{ padding: '8px 14px', borderRadius: 99, border: '1.5px solid rgba(200,90,138,0.4)', background: 'rgba(255,255,255,0.75)', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 13, fontWeight: 500, color: '#C85A8A', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
          {s}
        </button>
      ))}
    </div>
  )
}

export function FBubble({ msg, transactions }: { msg: ChatMessage; transactions: Transaction[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }} style={{ display: 'flex', alignItems: 'flex-end', gap: 8, direction: 'rtl' }}>
      <FiniAvatar size={32} mood="talk" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: '80%' }}>
        {msg.text && (
          <div style={{ background: '#FFFFFF', borderRadius: '20px 20px 20px 6px', padding: '12px 16px', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, color: '#1F1A15', lineHeight: 1.6, boxShadow: '0 2px 8px rgba(31,26,21,0.06)', whiteSpace: 'pre-line' }}>
            {msg.text}
          </div>
        )}
        {msg.type === 'txChip' && msg.txId && <TxChip txId={msg.txId} transactions={transactions} />}
        {msg.type === 'insight' && msg.insight && <InsightCard data={msg.insight} />}
      </div>
    </motion.div>
  )
}

export function UBubble({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', direction: 'rtl' }}>
      <div style={{ background: '#1F1A15', borderRadius: '20px 20px 6px 20px', padding: '12px 16px', maxWidth: '75%', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, color: '#F7F5E8', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
        {text}
      </div>
    </div>
  )
}

export function Composer({ onSend, onAddTx, disabled = false }: { onSend: (text: string) => void; onAddTx: () => void; disabled?: boolean }) {
  const [text, setText] = useState('')

  const canSend = !disabled && !!text.trim()

  const handleSend = () => {
    if (canSend) { onSend(text.trim()); setText('') }
  }

  return (
    <div style={{ padding: '10px 16px 20px', display: 'flex', alignItems: 'center', gap: 8, direction: 'rtl', background: 'rgba(253,221,232,0.8)', backdropFilter: 'blur(12px)' }}>
      <button
        onClick={onAddTx}
        disabled={disabled}
        title="הוסף עסקה"
        style={{ background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(31,26,21,0.1)' }}
      >
        <Icon name="plus" size={20} color="#C85A8A" />
      </button>
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.9)', borderRadius: 999, padding: '10px 16px', display: 'flex', alignItems: 'center', opacity: disabled ? 0.7 : 1 }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          disabled={disabled}
          placeholder={disabled ? 'פיני כותב...' : 'שאל את פיני...'}
          style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 14, color: '#1F1A15', outline: 'none', direction: 'rtl' }}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={!canSend}
        style={{ width: 40, height: 40, borderRadius: '50%', background: canSend ? '#C85A8A' : 'rgba(200,90,138,0.3)', border: 'none', cursor: canSend ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: canSend ? '0 4px 12px rgba(200,90,138,0.3)' : 'none', transition: 'all 0.2s' }}
      >
        <Icon name="send" size={18} color="#FFFFFF" />
      </button>
    </div>
  )
}

// ── Main export ──────────────────────────────────────────────

export function ChatMain({ nav, transactions, userName = 'נועה' }: ScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_MESSAGES)
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isTyping])

  const handleSend = (text: string) => {
    if (isTyping) return
    const userMsg: ChatMessage = { id: `u${Date.now()}`, role: 'user', type: 'text', text }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)
    setTimeout(() => {
      const responses = getAiResponse(text, transactions)
      setMessages(prev => [...prev, ...responses])
      setIsTyping(false)
    }, 900 + Math.random() * 600)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#FDDDE8', overflow: 'hidden' }}>
      <StatusBar />
      <ChatHeader nav={nav} />
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 120px', display: 'flex', flexDirection: 'column', gap: 12, direction: 'rtl' }}>
        <DailyBrief transactions={transactions} userName={userName} onAsk={handleSend} />
        <DateDivider date="היום" />
        {messages.map(msg => {
          if (msg.role === 'fini') {
            return (
              <div key={msg.id}>
                <FBubble msg={msg} transactions={transactions} />
                {msg.type === 'suggestions' && msg.suggestions && (
                  <div style={{ marginTop: 8, marginRight: 40 }}>
                    <SuggChips suggestions={msg.suggestions} onSelect={handleSend} />
                  </div>
                )}
              </div>
            )
          }
          return <UBubble key={msg.id} text={msg.text || ''} />
        })}
        {isTyping && <TypingIndicator />}
      </div>
      <Composer onSend={handleSend} onAddTx={() => nav('addTx')} disabled={isTyping} />
      <TabBar active="chat" onTab={t => nav(t)} />
    </div>
  )
}
