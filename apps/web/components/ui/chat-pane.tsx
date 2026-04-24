'use client'
import React, { useState, useRef, useEffect } from 'react'
import { FiniAvatar } from './fini-mascot'
import { Icon } from './icon'
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
 * ChatPane — desktop-only right column (≥1024px), persistent.
 * Hidden on mobile via `.fini-chat-pane { display: none }` in globals.css.
 *
 * Reuses the same mock AI engine (`getAiResponse`) and bubble primitives
 * as the mobile chat screen, so behavior stays consistent. State is local
 * to this pane — intentional for v1.2 MVP. When Convex lands, messages
 * will be hoisted up and shared with the mobile chat screen.
 */

function PaneHeader() {
  return (
    <div
      style={{
        padding: '16px 20px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        direction: 'rtl',
        borderBottom: '1px solid rgba(31,26,21,0.06)',
        background: 'rgba(253,221,232,0.6)',
        backdropFilter: 'blur(8px)',
        flexShrink: 0,
      }}
    >
      <div style={{ position: 'relative' }}>
        <FiniAvatar size={36} mood="happy" />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: '#5B8E6F',
            border: '2px solid #FDDDE8',
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: "'Rubik', system-ui, sans-serif",
            fontSize: 15,
            fontWeight: 700,
            color: '#1F1A15',
          }}
        >
          פיני
        </div>
        <div
          style={{
            fontFamily: "'Rubik', system-ui, sans-serif",
            fontSize: 11,
            color: '#5B8E6F',
            fontWeight: 500,
          }}
        >
          מחובר · מוכן לעזור
        </div>
      </div>
    </div>
  )
}

export function ChatPane({
  transactions,
  onAddTx,
}: {
  transactions: Transaction[]
  onAddTx: () => void
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_MESSAGES)
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isTyping])

  const handleSend = (text: string) => {
    if (isTyping) return
    const userMsg: ChatMessage = {
      id: `u${Date.now()}`,
      role: 'user',
      type: 'text',
      text,
    }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)
    setTimeout(
      () => {
        const responses = getAiResponse(text, transactions)
        setMessages((prev) => [...prev, ...responses])
        setIsTyping(false)
      },
      900 + Math.random() * 600
    )
  }

  return (
    <section className="fini-chat-pane" aria-label="שיחה עם פיני">
      <PaneHeader />

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          direction: 'rtl',
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

      <div style={{ flexShrink: 0 }}>
        <Composer onSend={handleSend} onAddTx={onAddTx} disabled={isTyping} />
      </div>
    </section>
  )
}
