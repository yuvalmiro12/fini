'use client'
import React, { useState, useRef, useEffect } from 'react'
import { FiniAvatar } from '../ui/fini-mascot'
import { Icon } from '../ui/icon'
import {
  getAiResponse,
  FBubble,
  UBubble,
  Composer,
  TypingIndicator,
  SuggChips,
} from '../screens/chat'
import { CHAT_MESSAGES } from '../../lib/seed'
import type { Transaction, ChatMessage } from '../../lib/seed'

/**
 * ChatDrawer — desktop floating assistant.
 * Closed state: small pill-shaped FAB bottom-left (RTL = bottom-left of viewport).
 * Open state:  420px drawer slides in from the same corner.
 *
 * Replaces the previous always-visible ChatPane. Rationale: chat shouldn't
 * dominate the desktop layout when the user is reading transactions or
 * drilling into a category. They can summon it when they need it.
 */

export function ChatDrawer({
  transactions,
  onAddTx,
}: {
  transactions: Transaction[]
  onAddTx: () => void
}) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_MESSAGES)
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [unread, setUnread] = useState(false)

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping, open])

  const handleSend = (text: string) => {
    if (isTyping) return
    const userMsg: ChatMessage = { id: `u${Date.now()}`, role: 'user', type: 'text', text }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)
    setTimeout(() => {
      const responses = getAiResponse(text, transactions)
      setMessages((prev) => [...prev, ...responses])
      setIsTyping(false)
      if (!open) setUnread(true)
    }, 900 + Math.random() * 600)
  }

  return (
    <>
      {/* Backdrop when open */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(31,26,21,0.15)',
            zIndex: 40,
            transition: 'opacity 0.2s ease',
          }}
        />
      )}

      {/* FAB (shown when closed) */}
      {!open && (
        <button
          onClick={() => { setOpen(true); setUnread(false) }}
          aria-label="פתח צ'אט עם פיני"
          style={{
            position: 'fixed',
            bottom: 28,
            left: 28,
            height: 54,
            padding: '0 8px 0 18px',
            minWidth: 54,
            borderRadius: 99,
            border: 'none',
            cursor: 'pointer',
            background: '#FDDDE8',
            boxShadow: '0 8px 24px rgba(200,90,138,0.25), 0 2px 6px rgba(31,26,21,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: "'Rubik', system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: '#1F1A15',
            zIndex: 45,
            direction: 'rtl',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(200,90,138,0.35), 0 2px 6px rgba(31,26,21,0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(200,90,138,0.25), 0 2px 6px rgba(31,26,21,0.1)'
          }}
        >
          <span style={{ position: 'relative' }}>
            <FiniAvatar size={38} mood="happy" />
            {unread && (
              <span
                style={{
                  position: 'absolute',
                  top: -2,
                  left: -2,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#C85A8A',
                  border: '2px solid #FDDDE8',
                }}
              />
            )}
          </span>
          <span>דבר עם פיני</span>
        </button>
      )}

      {/* Drawer */}
      <aside
        aria-hidden={!open}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          top: 0,
          width: 420,
          maxWidth: '92vw',
          background: '#FFFFFF',
          boxShadow: open ? '0 0 40px rgba(31,26,21,0.18)' : 'none',
          zIndex: 50,
          transform: open ? 'translateX(0)' : 'translateX(-110%)',
          transition: 'transform 0.28s cubic-bezier(0.22, 0.61, 0.36, 1)',
          display: 'flex',
          flexDirection: 'column',
          direction: 'rtl',
          fontFamily: "'Rubik', system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 18px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderBottom: '1px solid rgba(31,26,21,0.06)',
            background: 'linear-gradient(180deg, #FDDDE8 0%, rgba(253,221,232,0.4) 100%)',
            flexShrink: 0,
          }}
        >
          <div style={{ position: 'relative' }}>
            <FiniAvatar size={40} mood="happy" />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#5B8E6F',
                border: '2px solid #FDDDE8',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1F1A15' }}>פיני</div>
            <div style={{ fontSize: 11, color: '#5B8E6F', fontWeight: 500 }}>מחובר · מוכן לעזור</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="סגור"
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="close" size={16} color="#4A4237" />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {messages.map((msg) => {
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

        {/* Composer */}
        <div style={{ flexShrink: 0 }}>
          <Composer onSend={handleSend} onAddTx={onAddTx} disabled={isTyping} />
        </div>
      </aside>
    </>
  )
}
