'use client'
import React, { useState } from 'react'
import { Icon } from '../ui/icon'
import { CatIcon } from '../ui/cat-icon'
import { FiniAvatar } from '../ui/fini-mascot'
import { CATS } from '../../lib/cats'
import type { Transaction } from '../../lib/seed'

/**
 * TxDetailDesktop — 2-col detail view.
 * Left: hero card (amount + title + chips + insight) + action tile grid.
 * Right: metadata table, split/pay detail (mocked), related txs placeholder.
 */

interface Props {
  nav: (screen: string) => void
  selectedTxId: string | null
  transactions: Transaction[]
  onDelete: (id: string) => void
  onUpdate: (tx: Transaction) => void
  prevScreen?: string
}

const ALL_CATS = ['food', 'transport', 'shopping', 'health', 'home', 'entertainment', 'utilities', 'gifts', 'phone', 'travel', 'savings', 'income', 'other']

export function TxDetailDesktop({
  nav,
  selectedTxId,
  transactions,
  onDelete,
  onUpdate,
  prevScreen = 'transactions',
}: Props) {
  const tx = transactions.find((t) => t.id === selectedTxId) || transactions[0]
  const [showCatPicker, setShowCatPicker] = useState(false)
  const [flagged, setFlagged] = useState(tx?.flagged || false)
  const [receiptAdded, setReceiptAdded] = useState(false)
  const [editDate, setEditDate] = useState(tx?.date || '')
  const [editingDate, setEditingDate] = useState(false)

  if (!tx) {
    return (
      <div style={{ padding: '40px 28px', textAlign: 'center', direction: 'rtl', fontFamily: "'Rubik', system-ui, sans-serif" }}>
        <div style={{ fontSize: 15, color: '#8A8070' }}>לא נמצאה עסקה</div>
      </div>
    )
  }

  const currentCat = CATS[tx.category] || CATS.other

  const handleCatPick = (newCat: string) => {
    onUpdate({ ...tx, category: newCat })
    setShowCatPicker(false)
  }

  const handleFlag = () => {
    const newFlagged = !flagged
    setFlagged(newFlagged)
    onUpdate({ ...tx, flagged: newFlagged })
  }

  const handleSaveDate = () => {
    onUpdate({ ...tx, date: editDate })
    setEditingDate(false)
  }

  const handleDelete = () => {
    if (window.confirm('למחוק את העסקה הזו?')) onDelete(tx.id)
  }

  return (
    <div
      style={{
        padding: '24px 28px 80px',
        maxWidth: 1100,
        margin: '0 auto',
        direction: 'rtl',
        fontFamily: "'Rubik', system-ui, sans-serif",
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button
          onClick={() => nav(prevScreen)}
          style={{
            background: 'rgba(31,26,21,0.05)',
            border: 'none',
            borderRadius: 10,
            padding: '8px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: "'Rubik', system-ui, sans-serif",
            fontSize: 13,
            color: '#4A4237',
          }}
        >
          <Icon name="chevron-right" size={14} color="#4A4237" />
          חזור לעסקאות
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleFlag}
            style={{
              background: flagged ? '#F3E7C7' : '#FFFFFF',
              border: `1px solid ${flagged ? '#C9A24D' : 'rgba(31,26,21,0.1)'}`,
              borderRadius: 10,
              padding: '8px 14px',
              cursor: 'pointer',
              fontFamily: "'Rubik', system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: flagged ? '#C9A24D' : '#4A4237',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Icon name="bell" size={14} color={flagged ? '#C9A24D' : '#4A4237'} />
            {flagged ? 'מסומן' : 'סמן'}
          </button>
          <button
            onClick={handleDelete}
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(212,112,112,0.3)',
              borderRadius: 10,
              padding: '8px 14px',
              cursor: 'pointer',
              fontFamily: "'Rubik', system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: '#D47070',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Icon name="close" size={14} color="#D47070" />
            מחק
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: 18,
        }}
      >
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Hero card */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(31,26,21,0.06)',
              borderRadius: 16,
              padding: 28,
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <CatIcon cat={tx.category} size={72} radius={18} />
            </div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 700,
                color: tx.type === 'income' ? '#5B8E6F' : '#D47070',
                letterSpacing: -1.5,
                lineHeight: 1,
                marginBottom: 10,
              }}
            >
              {tx.type === 'income' ? '+' : '-'}₪{tx.amount.toLocaleString()}
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1F1A15', marginBottom: 4, letterSpacing: -0.3 }}>
              {tx.title}
            </div>
            <div style={{ fontSize: 13, color: '#8A8070' }}>
              {tx.date} · {tx.time}
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 18 }}>
              <div
                style={{
                  padding: '5px 12px',
                  borderRadius: 99,
                  background: currentCat.tint,
                  fontSize: 12,
                  fontWeight: 500,
                  color: currentCat.ink,
                }}
              >
                {currentCat.label}
              </div>
              <div
                style={{
                  padding: '5px 12px',
                  borderRadius: 99,
                  background: 'rgba(31,26,21,0.05)',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#4A4237',
                }}
              >
                כרטיס אשראי
              </div>
              {flagged && (
                <div
                  style={{
                    padding: '5px 12px',
                    borderRadius: 99,
                    background: '#F3E7C7',
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#C9A24D',
                  }}
                >
                  מסומן לבדיקה
                </div>
              )}
              {receiptAdded && (
                <div
                  style={{
                    padding: '5px 12px',
                    borderRadius: 99,
                    background: '#DDEEDF',
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#5B8E6F',
                  }}
                >
                  קבלה צורפה
                </div>
              )}
            </div>
          </div>

          {/* Fini insight */}
          <div
            style={{
              background: 'linear-gradient(135deg, #FDDDE8 0%, #F9C6D7 100%)',
              borderRadius: 14,
              padding: 20,
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            <FiniAvatar size={36} mood="happy" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#C85A8A', letterSpacing: 0.3, marginBottom: 4 }}>
                פיני אומר
              </div>
              <div style={{ fontSize: 14, color: '#1F1A15', lineHeight: 1.5 }}>
                {tx.type === 'income'
                  ? `הכנסה של ₪${tx.amount.toLocaleString()} — כל הכבוד. שקלי להעביר חלק מהסכום ליעד החיסכון.`
                  : `הוצאת ₪${tx.amount.toLocaleString()} על ${currentCat.label}. ${
                      tx.amount > 200 ? 'זו הוצאה גדולה יחסית לקטגוריה — כדאי לבדוק.' : 'נראה סביר ביחס לממוצע הקטגוריה.'
                    }`}
              </div>
            </div>
          </div>

          {/* Action tiles */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(31,26,21,0.06)',
              borderRadius: 14,
              padding: 18,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1F1A15', marginBottom: 12 }}>פעולות</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {[
                { icon: 'tag', label: 'שנה קטגוריה', action: () => setShowCatPicker(true), color: '#5A6FB8' },
                {
                  icon: 'calendar',
                  label: editingDate ? 'שמור תאריך חדש' : 'שנה תאריך',
                  action: editingDate ? handleSaveDate : () => setEditingDate(true),
                  color: '#C9A24D',
                },
                {
                  icon: 'receipt',
                  label: receiptAdded ? 'קבלה צורפה' : 'הוסף קבלה',
                  action: () => setReceiptAdded(true),
                  color: '#5B8E6F',
                },
                {
                  icon: 'bell',
                  label: flagged ? 'הסר סימון' : 'סמן לבדיקה',
                  action: handleFlag,
                  color: '#C85A8A',
                },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={a.action}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid rgba(31,26,21,0.06)',
                    background: '#FAFAF5',
                    cursor: 'pointer',
                    fontFamily: "'Rubik', system-ui, sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#1F1A15',
                    direction: 'rtl',
                    textAlign: 'right',
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: a.color + '18',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name={a.icon} size={15} color={a.color} />
                  </div>
                  <span>{a.label}</span>
                </button>
              ))}
            </div>

            {editingDate && (
              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  background: '#FAFAF5',
                  borderRadius: 10,
                  border: '1px solid rgba(31,26,21,0.06)',
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '9px 11px',
                    border: '1px solid rgba(31,26,21,0.08)',
                    borderRadius: 8,
                    background: '#FFFFFF',
                    fontFamily: "'Rubik', system-ui, sans-serif",
                    fontSize: 13,
                  }}
                />
                <button
                  onClick={() => setEditingDate(false)}
                  style={{
                    padding: '9px 14px',
                    border: '1px solid rgba(31,26,21,0.08)',
                    borderRadius: 8,
                    background: '#FFFFFF',
                    cursor: 'pointer',
                    fontFamily: "'Rubik', system-ui, sans-serif",
                    fontSize: 13,
                    color: '#4A4237',
                  }}
                >
                  ביטול
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column — metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(31,26,21,0.06)',
              borderRadius: 14,
              padding: 20,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1F1A15', marginBottom: 14 }}>פרטי עסקה</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { label: 'סוג',       value: tx.type === 'income' ? 'הכנסה' : 'הוצאה' },
                { label: 'קטגוריה',  value: currentCat.label },
                { label: 'סכום',      value: `₪${tx.amount.toLocaleString()}` },
                { label: 'תאריך',     value: tx.date },
                { label: 'שעה',       value: tx.time },
                { label: 'אמצעי תשלום', value: 'ויזה ••4829' },
                { label: 'מזהה',      value: tx.id, mono: true },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '11px 0',
                    borderBottom: i < arr.length - 1 ? '1px solid rgba(31,26,21,0.05)' : 'none',
                  }}
                >
                  <span style={{ fontSize: 12, color: '#8A8070' }}>{row.label}</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#1F1A15',
                      fontFamily: row.mono ? 'monospace' : undefined,
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(31,26,21,0.06)',
              borderRadius: 14,
              padding: 20,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1F1A15', marginBottom: 10 }}>מקום</div>
            <div style={{ fontSize: 13, color: '#4A4237', lineHeight: 1.5 }}>
              לא זוהה מיקום לעסקה הזו. ניתן להוסיף ידנית דרך פעולות נוספות.
            </div>
          </div>
        </div>
      </div>

      {/* Category picker overlay */}
      {showCatPicker && (
        <div
          onClick={() => setShowCatPicker(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(31,26,21,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              padding: 24,
              width: 480,
              maxWidth: '90vw',
              direction: 'rtl',
              fontFamily: "'Rubik', system-ui, sans-serif",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1F1A15', marginBottom: 16, textAlign: 'center' }}>
              בחר קטגוריה
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
              {ALL_CATS.map((cat) => {
                const def = CATS[cat]
                if (!def) return null
                const active = tx.category === cat
                return (
                  <button
                    key={cat}
                    onClick={() => handleCatPick(cat)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 5,
                      padding: 10,
                      borderRadius: 10,
                      border: `1.5px solid ${active ? '#C85A8A' : 'rgba(31,26,21,0.05)'}`,
                      background: active ? 'rgba(200,90,138,0.08)' : '#FAFAF5',
                      cursor: 'pointer',
                    }}
                  >
                    <CatIcon cat={cat} size={34} radius={9} />
                    <span style={{ fontSize: 10, color: '#4A4237', fontWeight: active ? 600 : 500, textAlign: 'center' }}>
                      {def.label}
                    </span>
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setShowCatPicker(false)}
              style={{
                width: '100%',
                marginTop: 16,
                padding: '11px',
                borderRadius: 10,
                border: 'none',
                background: 'rgba(31,26,21,0.05)',
                cursor: 'pointer',
                fontFamily: "'Rubik', system-ui, sans-serif",
                fontSize: 13,
                color: '#4A4237',
              }}
            >
              ביטול
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
