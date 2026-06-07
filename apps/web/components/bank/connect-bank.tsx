'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useAction, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Icon } from '../ui/icon'
import { BANK_PROVIDERS, FIELD_META, getProvider, type LoginFieldKey } from '../../lib/bank-providers'

const STATUS_META: Record<string, { label: string; bg: string; fg: string }> = {
  connected:    { label: 'מחובר', bg: '#E6F3EC', fg: '#3A6B4F' },
  syncing:      { label: 'מסנכרן…', bg: '#E8ECFF', fg: '#3D539A' },
  error:        { label: 'שגיאה', bg: '#FBE6E6', fg: '#A14040' },
  needs_action: { label: 'דרושה פעולה', bg: '#FBF1E0', fg: '#9A6A1E' },
}

function fmtDate(ms?: number): string {
  if (!ms) return 'טרם סונכרן'
  try {
    return new Intl.DateTimeFormat('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(ms))
  } catch {
    return new Date(ms).toLocaleString()
  }
}

type Variant = 'desktop' | 'mobile'

export function BankAccountsPanel({ variant = 'desktop' }: { variant?: Variant }) {
  const ensureUser = useMutation(api.users.getOrCreateMockUser)
  const createConn = useAction(api.bank.create)
  const syncConn = useAction(api.bank.sync)
  const removeConn = useMutation(api.bankConnections.remove)

  const [userId, setUserId] = useState<string | null>(null)
  useEffect(() => { ensureUser().then((id) => setUserId(id as string)).catch(() => {}) }, [])

  const connections = useQuery(api.bankConnections.list, userId ? { userId } : 'skip') ?? []

  const [showForm, setShowForm] = useState(false)
  const [providerId, setProviderId] = useState('leumi')
  const [creds, setCreds] = useState<Record<string, string>>({})
  const [label, setLabel] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const provider = useMemo(() => getProvider(providerId), [providerId])
  const requiredFields: LoginFieldKey[] = provider?.loginFields ?? []
  const canSubmit = !!provider && !provider.unsupported && requiredFields.every((f) => (creds[f] || '').trim().length > 0)

  const resetForm = () => { setCreds({}); setLabel(''); setFormError(null) }

  const handleConnect = async () => {
    if (!userId || !provider || !canSubmit) return
    setSubmitting(true)
    setFormError(null)
    try {
      const { connectionId } = await createConn({
        userId,
        provider: provider.id,
        label: label.trim() || undefined,
        credentials: creds,
      })
      setShowForm(false)
      resetForm()
      // Kick off an initial sync right away.
      setBusyId(connectionId)
      await syncConn({ userId, connectionId }).catch(() => {})
      setBusyId(null)
    } catch (err) {
      setFormError('שמירת החיבור נכשלה. נסה שוב.')
      console.error('connect failed', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSync = async (connectionId: string) => {
    if (!userId) return
    setBusyId(connectionId)
    try {
      await syncConn({ userId, connectionId })
    } catch (err) {
      console.error('sync failed', err)
    } finally {
      setBusyId(null)
    }
  }

  const handleRemove = async (connectionId: string) => {
    if (!userId) return
    if (!window.confirm('להסיר את החשבון המחובר? העסקאות שכבר יובאו יישמרו.')) return
    await removeConn({ userId, connectionId }).catch(() => {})
  }

  const pad = variant === 'mobile' ? 14 : 16
  const radius = variant === 'mobile' ? 16 : 14

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, direction: 'rtl', fontFamily: "'Rubik', system-ui, sans-serif" }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1F1A15' }}>חשבונות מחוברים</div>
        <button
          onClick={() => { setShowForm((v) => !v); resetForm() }}
          style={{ marginRight: 'auto', background: showForm ? '#3D539A' : '#5A6FB8', border: 'none', borderRadius: 10, padding: '8px 13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, color: '#FFFFFF', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}
        >
          <Icon name="plus" size={15} color="#FFFFFF" />
          חבר חשבון בנק
        </button>
      </div>

      {/* Connect form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            style={{ padding: pad, background: '#FFFFFF', borderRadius: radius, border: '1px solid rgba(31,26,21,0.08)', display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, color: '#8A8070' }}>בנק / חברת אשראי</label>
              <select
                value={providerId}
                onChange={(e) => { setProviderId(e.target.value); setCreds({}); setFormError(null) }}
                style={{ padding: '9px 10px', borderRadius: 10, border: '1px solid rgba(31,26,21,0.12)', fontSize: 13, color: '#1F1A15', background: '#FFFFFF', direction: 'rtl', fontFamily: 'inherit' }}
              >
                <optgroup label="חשבונות בנק">
                  {BANK_PROVIDERS.filter((p) => p.kind === 'bank').map((p) => (
                    <option key={p.id} value={p.id} disabled={p.unsupported}>{p.label}{p.unsupported ? ' (בקרוב)' : ''}</option>
                  ))}
                </optgroup>
                <optgroup label="כרטיסי אשראי">
                  {BANK_PROVIDERS.filter((p) => p.kind === 'card').map((p) => (
                    <option key={p.id} value={p.id} disabled={p.unsupported}>{p.label}{p.unsupported ? ' (בקרוב)' : ''}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {provider?.unsupported ? (
              <div style={{ fontSize: 12, color: '#9A6A1E', background: '#FBF1E0', borderRadius: 10, padding: '8px 10px' }}>
                {provider.note || 'ספק זה אינו נתמך כרגע.'}
              </div>
            ) : (
              <>
                {requiredFields.map((f) => {
                  const meta = FIELD_META[f]
                  return (
                    <div key={f} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: 11, color: '#8A8070' }}>{meta.label}</label>
                      <input
                        type={meta.type}
                        value={creds[f] || ''}
                        autoComplete="off"
                        placeholder={meta.placeholder}
                        onChange={(e) => setCreds((c) => ({ ...c, [f]: e.target.value }))}
                        style={{ padding: '9px 10px', borderRadius: 10, border: '1px solid rgba(31,26,21,0.12)', fontSize: 13, color: '#1F1A15', background: '#FFFFFF', outline: 'none', direction: 'ltr', textAlign: 'right', fontFamily: 'inherit' }}
                      />
                    </div>
                  )
                })}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 11, color: '#8A8070' }}>תיוג חשבון (אופציונלי)</label>
                  <input
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="לדוגמה: עו״ש משותף"
                    style={{ padding: '9px 10px', borderRadius: 10, border: '1px solid rgba(31,26,21,0.12)', fontSize: 13, color: '#1F1A15', background: '#FFFFFF', outline: 'none', direction: 'rtl', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ fontSize: 11, color: '#8A8070', lineHeight: 1.5 }}>
                  🔒 פרטי ההתחברות נשמרים מוצפנים ומשמשים רק למשיכת העסקאות שלך.
                </div>

                {formError && <div style={{ fontSize: 12, color: '#A14040' }}>{formError}</div>}

                <button
                  onClick={handleConnect}
                  disabled={!canSubmit || submitting || !userId}
                  style={{ padding: '10px 12px', borderRadius: 12, border: 'none', background: !canSubmit || submitting || !userId ? '#A0AABF' : '#5A6FB8', color: '#FFFFFF', fontSize: 14, fontWeight: 600, cursor: !canSubmit || submitting || !userId ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}
                >
                  {submitting ? 'מתחבר…' : 'התחבר וסנכרן'}
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connected accounts list */}
      {connections.length === 0 && !showForm ? (
        <div style={{ padding: '18px 16px', background: '#FFFFFF', borderRadius: radius, border: '1px dashed rgba(31,26,21,0.14)', textAlign: 'center', color: '#8A8070', fontSize: 13 }}>
          אין עדיין חשבונות מחוברים. חבר חשבון כדי למשוך עסקאות אוטומטית.
        </div>
      ) : (
        connections.map((conn: any) => {
          const meta = STATUS_META[conn.status] || STATUS_META.connected
          const provLabel = getProvider(conn.provider)?.label || conn.provider
          const isBusy = busyId === conn._id || conn.status === 'syncing'
          return (
            <div key={conn._id} style={{ padding: pad, background: '#FFFFFF', borderRadius: radius, border: '1px solid rgba(31,26,21,0.08)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#E8ECFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="wallet" size={20} color="#5A6FB8" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1F1A15' }}>{conn.label || provLabel}</div>
                  <div style={{ fontSize: 11, color: '#8A8070' }}>{conn.label ? provLabel + ' · ' : ''}עדכון אחרון: {fmtDate(conn.lastSyncAt)}</div>
                </div>
                <span style={{ marginRight: 'auto', background: meta.bg, color: meta.fg, fontSize: 11, fontWeight: 600, padding: '4px 9px', borderRadius: 99 }}>{meta.label}</span>
              </div>

              {typeof conn.balance === 'number' && (
                <div style={{ fontSize: 12, color: '#4A4237' }}>יתרה: ₪{conn.balance.toLocaleString()}</div>
              )}

              {conn.lastError && (conn.status === 'error' || conn.status === 'needs_action') && (
                <div style={{ fontSize: 12, color: meta.fg, background: meta.bg, borderRadius: 10, padding: '8px 10px' }}>{conn.lastError}</div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleSync(conn._id)}
                  disabled={isBusy || !userId}
                  style={{ flex: 1, padding: '9px 12px', borderRadius: 10, border: 'none', background: isBusy ? '#A0AABF' : '#5A6FB8', color: '#FFFFFF', fontSize: 13, fontWeight: 600, cursor: isBusy ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: 'inherit' }}
                >
                  <Icon name="upload" size={15} color="#FFFFFF" />
                  {isBusy ? 'מסנכרן…' : 'סנכרן עכשיו'}
                </button>
                <button
                  onClick={() => handleRemove(conn._id)}
                  disabled={isBusy || !userId}
                  style={{ padding: '9px 12px', borderRadius: 10, border: '1px solid rgba(31,26,21,0.12)', background: '#FFFFFF', color: '#A14040', fontSize: 13, fontWeight: 600, cursor: isBusy ? 'default' : 'pointer', fontFamily: 'inherit' }}
                >
                  הסר
                </button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
