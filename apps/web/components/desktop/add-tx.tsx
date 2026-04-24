'use client'
import React, { useState } from 'react'
import { Icon } from '../ui/icon'
import { CatIcon } from '../ui/cat-icon'
import { FiniAvatar } from '../ui/fini-mascot'
import { CATS } from '../../lib/cats'
import type { Transaction } from '../../lib/seed'

/**
 * AddTxDesktop — centered single-card form (640px) for adding a transaction.
 * Type toggle, big amount input, category grid, description, date row, save bar.
 */

interface Props {
  nav: (screen: string) => void
  onSave: (tx: Transaction) => void
  prevScreen?: string
}

const ADD_CATS = ['food', 'transport', 'shopping', 'health', 'home', 'entertainment', 'utilities', 'gifts', 'phone', 'other']

export function AddTxDesktop({ nav, onSave, prevScreen = 'transactions' }: Props) {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [selectedCat, setSelectedCat] = useState('food')
  const [desc, setDesc] = useState('')
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
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

  const accent = type === 'expense' ? '#D47070' : '#5B8E6F'

  return (
    <div
      style={{
        padding: '24px 28px 80px',
        maxWidth: 720,
        margin: '0 auto',
        direction: 'rtl',
        fontFamily: "'Rubik', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(31,26,21,0.06)',
          borderRadius: 16,
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1F1A15', letterSpacing: -0.3 }}>הוסף עסקה</div>
            <div style={{ fontSize: 12, color: '#8A8070', marginTop: 2 }}>הזן את פרטי העסקה ושמור</div>
          </div>
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
            <Icon name="close" size={14} color="#4A4237" />
            ביטול
          </button>
        </div>

        {/* Fini nudge */}
        <div
          style={{
            background: '#FDDDE8',
            borderRadius: 12,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <FiniAvatar size={28} mood="talk" />
          <span style={{ fontSize: 12, color: '#4A4237' }}>ספר לי על עסקה חדשה — אני אסדר את הכל</span>
        </div>

        {/* Type toggle */}
        <div
          style={{
            display: 'flex',
            background: '#FAFAF5',
            borderRadius: 12,
            padding: 4,
            border: '1px solid rgba(31,26,21,0.06)',
          }}
        >
          {(['expense', 'income'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setType(t)
                setError('')
              }}
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: 9,
                border: 'none',
                background: type === t ? '#FFFFFF' : 'transparent',
                cursor: 'pointer',
                fontFamily: "'Rubik', system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: type === t ? (t === 'expense' ? '#D47070' : '#5B8E6F') : '#8A8070',
                boxShadow: type === t ? '0 1px 4px rgba(31,26,21,0.08)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {t === 'expense' ? 'הוצאה' : 'הכנסה'}
            </button>
          ))}
        </div>

        {/* Amount hero */}
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div style={{ fontSize: 11, color: '#8A8070', fontWeight: 500, marginBottom: 8, letterSpacing: 0.3, textTransform: 'uppercase' }}>
            סכום
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <span style={{ fontSize: 34, fontWeight: 600, color: accent }}>₪</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setError('')
              }}
              placeholder="0"
              autoFocus
              style={{
                fontFamily: "'Rubik', system-ui, sans-serif",
                fontSize: 62,
                fontWeight: 700,
                color: accent,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: 260,
                textAlign: 'center',
                letterSpacing: -1,
              }}
            />
          </div>
          {error && (
            <div style={{ fontSize: 12, color: '#D47070', marginTop: 6 }}>
              {error}
            </div>
          )}
        </div>

        {/* Category grid */}
        {type === 'expense' && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#4A4237', marginBottom: 10 }}>קטגוריה</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {ADD_CATS.map((cat) => {
                const def = CATS[cat]
                const isSelected = selectedCat === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      padding: '12px 6px',
                      borderRadius: 11,
                      border: `1.5px solid ${isSelected ? '#C85A8A' : 'rgba(31,26,21,0.05)'}`,
                      background: isSelected ? 'rgba(200,90,138,0.08)' : '#FAFAF5',
                      cursor: 'pointer',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    <CatIcon cat={cat} size={30} radius={8} />
                    <span style={{ fontSize: 10, color: '#4A4237', textAlign: 'center', fontWeight: isSelected ? 600 : 500 }}>
                      {def?.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4A4237', marginBottom: 8 }}>
            שם העסקה
          </label>
          <div
            style={{
              background: '#FAFAF5',
              border: '1px solid rgba(31,26,21,0.08)',
              borderRadius: 10,
              padding: '11px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Icon name="receipt" size={16} color="#8A8070" />
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={type === 'income' ? 'למשל: משכורת' : 'למשל: סופרמרקט'}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                fontFamily: "'Rubik', system-ui, sans-serif",
                fontSize: 14,
                color: '#1F1A15',
                outline: 'none',
                direction: 'rtl',
              }}
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4A4237', marginBottom: 8 }}>
            תאריך
          </label>
          <div
            style={{
              background: '#FAFAF5',
              border: '1px solid rgba(31,26,21,0.08)',
              borderRadius: 10,
              padding: '11px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Icon name="calendar" size={16} color="#8A8070" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                fontFamily: "'Rubik', system-ui, sans-serif",
                fontSize: 14,
                color: '#1F1A15',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Action bar */}
        <div style={{ display: 'flex', gap: 10, borderTop: '1px solid rgba(31,26,21,0.05)', paddingTop: 20 }}>
          <button
            onClick={() => nav(prevScreen)}
            style={{
              padding: '12px 20px',
              borderRadius: 10,
              background: 'transparent',
              border: '1px solid rgba(31,26,21,0.1)',
              cursor: 'pointer',
              fontFamily: "'Rubik', system-ui, sans-serif",
              fontSize: 14,
              color: '#4A4237',
              fontWeight: 500,
            }}
          >
            ביטול
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 10,
              background: accent,
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Rubik', system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: '#FFFFFF',
            }}
          >
            שמור עסקה
          </button>
        </div>
      </div>
    </div>
  )
}
