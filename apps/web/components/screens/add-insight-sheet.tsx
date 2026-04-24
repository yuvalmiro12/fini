'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '../ui/icon'
import { FiniAvatar } from '../ui/fini-mascot'
import {
  INSIGHT_TEMPLATES,
  generateInsightFromPrompt,
  type Insight,
} from '../../lib/insight-templates'

/**
 * AddInsightSheet — mobile bottom-sheet counterpart to the desktop
 * AddInsightModal. Slides up from the bottom, full width, 85% height.
 * Two tabs: "מרשימה" (12 templates) and "עם AI" (mock prompt → insight).
 */

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (insight: Insight) => void
  existingIds: string[]
}

export function AddInsightSheet({ open, onClose, onAdd, existingIds }: Props) {
  const [tab, setTab] = useState<'list' | 'ai'>('list')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<Insight | null>(null)

  const handlePickTemplate = (tmpl: Insight) => {
    const clone: Insight = {
      ...tmpl,
      id: `ins_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    }
    onAdd(clone)
    handleClose()
  }

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setPreview(null)
    const insight = await generateInsightFromPrompt(prompt)
    setPreview(insight)
    setLoading(false)
  }

  const handleConfirmAi = () => {
    if (preview) {
      onAdd(preview)
      handleClose()
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setPrompt('')
      setPreview(null)
      setTab('list')
      setLoading(false)
    }, 260)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(31,26,21,0.5)',
            zIndex: 30,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            direction: 'rtl',
            fontFamily: "'Rubik', system-ui, sans-serif",
          }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            style={{
              background: '#FFFFFF',
              borderTopLeftRadius: 22,
              borderTopRightRadius: 22,
              width: '100%',
              maxHeight: '86%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 -8px 28px rgba(31,26,21,0.2)',
            }}
          >
            {/* Grabber */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
              <div
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  background: 'rgba(31,26,21,0.14)',
                }}
              />
            </div>

            {/* Header */}
            <div
              style={{
                padding: '10px 20px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#1F1A15', letterSpacing: -0.2 }}>
                  הוסף תובנה חדשה
                </div>
                <div style={{ fontSize: 11, color: '#8A8070', marginTop: 2 }}>
                  מרשימה מוכנה או בקש מפיני
                </div>
              </div>
              <button
                onClick={handleClose}
                style={{
                  background: 'rgba(31,26,21,0.05)',
                  border: 'none',
                  borderRadius: 10,
                  padding: 8,
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <Icon name="close" size={16} color="#4A4237" />
              </button>
            </div>

            {/* Tabs */}
            <div style={{ padding: '12px 20px 0' }}>
              <div
                style={{
                  display: 'flex',
                  background: '#FAFAF5',
                  borderRadius: 11,
                  padding: 4,
                  border: '1px solid rgba(31,26,21,0.06)',
                }}
              >
                {(['list', 'ai'] as const).map((t) => {
                  const active = tab === t
                  return (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: 8,
                        border: 'none',
                        background: active ? '#FFFFFF' : 'transparent',
                        cursor: 'pointer',
                        fontFamily: "'Rubik', system-ui, sans-serif",
                        fontSize: 13,
                        fontWeight: active ? 600 : 500,
                        color: active ? '#1F1A15' : '#8A8070',
                        boxShadow: active ? '0 1px 3px rgba(31,26,21,0.06)' : 'none',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <Icon
                        name={t === 'list' ? 'data' : 'sparkle'}
                        size={13}
                        color={active ? '#C85A8A' : '#8A8070'}
                      />
                      {t === 'list' ? 'מרשימה' : 'עם AI'}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: '14px 20px 22px' }}>
              <AnimatePresence mode="wait">
                {tab === 'list' ? (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.18 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                  >
                    {INSIGHT_TEMPLATES.map((tmpl, i) => {
                      const used = existingIds.includes(tmpl.id)
                      return (
                        <motion.button
                          key={tmpl.id}
                          onClick={() => handlePickTemplate(tmpl)}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.025, duration: 0.18 }}
                          whileTap={{ scale: 0.97 }}
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid rgba(31,26,21,0.08)',
                            borderRadius: 12,
                            padding: '11px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            cursor: 'pointer',
                            direction: 'rtl',
                            textAlign: 'right',
                            fontFamily: "'Rubik', system-ui, sans-serif",
                            opacity: used ? 0.55 : 1,
                            width: '100%',
                          }}
                        >
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: 10,
                              background: tmpl.tint,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Icon name={tmpl.icon} size={19} color={tmpl.ink} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#1F1A15' }}>
                              {tmpl.title}
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: '#8A8070',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                marginTop: 1,
                              }}
                            >
                              {tmpl.subtitle}
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: tmpl.positive ? '#5B8E6F' : '#D47070',
                              padding: '3px 8px',
                              borderRadius: 99,
                              background: tmpl.positive ? '#DDEEDF' : '#FADEDC',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {tmpl.value}
                          </div>
                        </motion.button>
                      )
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="ai"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #FDDDE8 0%, #F9C6D7 100%)',
                        borderRadius: 12,
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        marginBottom: 12,
                      }}
                    >
                      <FiniAvatar size={30} mood="talk" />
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: '#C85A8A',
                            letterSpacing: 0.2,
                            marginBottom: 2,
                          }}
                        >
                          פיני יכין לך תובנה
                        </div>
                        <div style={{ fontSize: 12, color: '#1F1A15', lineHeight: 1.45 }}>
                          כתוב נושא — למשל "הוצאות על קפה" או "חיוב טלפון".
                        </div>
                      </div>
                    </div>

                    <label
                      style={{
                        display: 'block',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#4A4237',
                        marginBottom: 6,
                      }}
                    >
                      על מה תרצה תובנה?
                    </label>
                    <input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                      placeholder="למשל: הוצאות על קפה..."
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 10,
                        border: '1px solid rgba(31,26,21,0.1)',
                        fontFamily: "'Rubik', system-ui, sans-serif",
                        fontSize: 14,
                        color: '#1F1A15',
                        outline: 'none',
                        background: '#FAFAF5',
                        direction: 'rtl',
                        boxSizing: 'border-box',
                        marginBottom: 10,
                      }}
                    />
                    <button
                      onClick={handleGenerate}
                      disabled={!prompt.trim() || loading}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: 10,
                        background:
                          !prompt.trim() || loading ? 'rgba(200,90,138,0.35)' : '#C85A8A',
                        color: '#FFFFFF',
                        border: 'none',
                        cursor: !prompt.trim() || loading ? 'not-allowed' : 'pointer',
                        fontFamily: "'Rubik', system-ui, sans-serif",
                        fontSize: 14,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <Icon name="sparkle" size={14} color="#FFFFFF" />
                      {loading ? 'חושב...' : 'צור תובנה'}
                    </button>

                    <AnimatePresence mode="wait">
                      {loading && (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          style={{
                            marginTop: 14,
                            padding: 14,
                            background: '#FAFAF5',
                            border: '1px dashed rgba(200,90,138,0.35)',
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                          }}
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
                            style={{ display: 'flex' }}
                          >
                            <Icon name="sparkle" size={16} color="#C85A8A" />
                          </motion.div>
                          <div style={{ fontSize: 13, color: '#4A4237' }}>
                            פיני מנתח...
                          </div>
                        </motion.div>
                      )}

                      {preview && !loading && (
                        <motion.div
                          key="preview"
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
                          style={{ marginTop: 14 }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              color: '#8A8070',
                              marginBottom: 6,
                              letterSpacing: 0.3,
                              textTransform: 'uppercase',
                            }}
                          >
                            תצוגה מקדימה
                          </div>
                          <div
                            style={{
                              background: '#FFFFFF',
                              border: '2px solid #C85A8A',
                              borderRadius: 12,
                              padding: 14,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              marginBottom: 10,
                            }}
                          >
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                background: preview.tint,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <Icon name={preview.icon} size={20} color={preview.ink} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{ fontSize: 13, fontWeight: 600, color: '#1F1A15' }}
                              >
                                {preview.title}
                              </div>
                              <div style={{ fontSize: 11, color: '#4A4237', marginTop: 2 }}>
                                {preview.subtitle}
                              </div>
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: preview.positive ? '#5B8E6F' : '#D47070',
                                padding: '3px 8px',
                                borderRadius: 99,
                                background: preview.positive ? '#DDEEDF' : '#FADEDC',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {preview.value}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={handleGenerate}
                              style={{
                                padding: '10px 14px',
                                borderRadius: 10,
                                background: 'transparent',
                                border: '1px solid rgba(31,26,21,0.12)',
                                cursor: 'pointer',
                                fontFamily: "'Rubik', system-ui, sans-serif",
                                fontSize: 12,
                                fontWeight: 500,
                                color: '#4A4237',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 5,
                              }}
                            >
                              <Icon name="sparkle" size={12} color="#4A4237" />
                              נסה שוב
                            </button>
                            <button
                              onClick={handleConfirmAi}
                              style={{
                                flex: 1,
                                padding: '10px 14px',
                                borderRadius: 10,
                                background: '#1F1A15',
                                color: '#F7F5E8',
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: "'Rubik', system-ui, sans-serif",
                                fontSize: 13,
                                fontWeight: 600,
                              }}
                            >
                              הוסף לתובנות
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
