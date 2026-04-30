'use client'
import React, { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth, useUser, UserButton } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import type { Id } from '../convex/_generated/dataModel'
import { ObWelcome, ObGoal, ObIncome, ObPlan, ObTrial } from '../components/screens/onboarding'
import { ChatMain } from '../components/screens/chat'
import { InsightsMain, SavingsGoal } from '../components/screens/insights'
import { DataMain, TransactionsList } from '../components/screens/data'
import { TxDetailSheet, AddTx, Paywall, Couples } from '../components/screens/sheets'
import { Settings } from '../components/screens/settings'
import { NotificationsScreen } from '../components/screens/notifications'
import { Toast, ToastData, ToastType } from '../components/ui/toast'
import { DesktopShell } from '../components/desktop/desktop-shell'
import { TRANSACTIONS, SAVINGS_GOAL } from '../lib/seed'
import type { Transaction, SavingsGoal as SavingsGoalType } from '../lib/seed'

export type Screen =
  | 'obWelcome' | 'obGoal' | 'obIncome' | 'obPlan' | 'obTrial'
  | 'chat' | 'insights' | 'savingsGoal' | 'data'
  | 'transactions' | 'txDetail' | 'addTx' | 'paywall'
  | 'couples' | 'settings' | 'notifications'

export default function Page() {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const getOrCreate = useMutation(api.users.getOrCreate)
  const me = useQuery(api.users.getMe)

  const [convexUserId, setConvexUserId] = useState<Id<'users'> | null>(null)
  const [screen, setScreen] = useState<Screen>('obWelcome')
  const [prevScreen, setPrevScreen] = useState<Screen>('data')
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS)
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null)
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoalType>(SAVINGS_GOAL)
  const [plan, setPlan] = useState<'free' | 'pro' | 'proplus'>('free')
  const [pendingPlan, setPendingPlan] = useState<'free' | 'pro' | 'proplus'>('pro')
  const [userName, setUserName] = useState('משתמש')
  const [hydrated, setHydrated] = useState(false)
  const [toast, setToast] = useState<ToastData | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync Clerk user → Convex on first load
  useEffect(() => {
    if (isSignedIn && !convexUserId) {
      getOrCreate().then(id => setConvexUserId(id)).catch(console.error)
    }
  }, [isSignedIn, convexUserId, getOrCreate])

  // Sync display name from Clerk
  useEffect(() => {
    if (user?.firstName) setUserName(user.firstName)
    else if (me?.name) setUserName(me.name)
  }, [user, me])

  const showToast = (message: string, type: ToastType = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    setToast({ id, message, type })
    toastTimerRef.current = setTimeout(() => setToast(null), 2500)
  }

  const dismissToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast(null)
  }

  useEffect(() => {
    try {
      const complete = localStorage.getItem('onboardingComplete')
      const saved = localStorage.getItem('currentScreen')
      if (complete === 'true' && saved) setScreen(saved as Screen)
      const savedTxs = localStorage.getItem('transactions')
      if (savedTxs) setTransactions(JSON.parse(savedTxs))
      const savedGoal = localStorage.getItem('savingsGoal')
      if (savedGoal) setSavingsGoal(JSON.parse(savedGoal))
      const savedPlan = localStorage.getItem('plan')
      if (savedPlan) setPlan(savedPlan as 'free' | 'pro' | 'proplus')
      const savedName = localStorage.getItem('userName')
      if (savedName) setUserName(savedName)
    } catch {}

    // Force-mobile preview: ?m=1 URL flag OR NEXT_PUBLIC_FORCE_MOBILE env.
    // When on, <html> gets `force-mobile` class which activates CSS
    // overrides in globals.css that hide DesktopShell and constrain the
    // mobile shell to a 420px phone frame on a dark backdrop.
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('m') === '1'
      const fromEnv = process.env.NEXT_PUBLIC_FORCE_MOBILE === '1'
      if (fromUrl || fromEnv) {
        document.documentElement.classList.add('force-mobile')
      }
    } catch {}

    setHydrated(true)
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    }
  }, [])

  const nav = (s: string) => {
    const newScreen = s as Screen
    setPrevScreen(screen)
    setScreen(newScreen)
    try {
      localStorage.setItem('currentScreen', s)
      if (['chat', 'insights', 'data', 'savingsGoal', 'transactions'].includes(s)) {
        localStorage.setItem('onboardingComplete', 'true')
      }
    } catch {}
  }

  const saveTxs = (txs: Transaction[]) => {
    setTransactions(txs)
    try { localStorage.setItem('transactions', JSON.stringify(txs)) } catch {}
  }

  const addTx = (tx: Transaction) => {
    saveTxs([tx, ...transactions])
    showToast('עסקה נוספה', 'success')
  }

  const deleteTx = (id: string) => {
    saveTxs(transactions.filter(t => t.id !== id))
    showToast('עסקה נמחקה', 'info')
    nav('transactions')
  }

  const updateTx = (updated: Transaction) => {
    saveTxs(transactions.map(t => t.id === updated.id ? updated : t))
    showToast('עסקה עודכנה', 'success')
  }

  const selectTx = (id: string) => {
    setSelectedTxId(id)
    nav('txDetail')
  }

  const updateGoal = (goal: SavingsGoalType) => {
    setSavingsGoal(goal)
    try { localStorage.setItem('savingsGoal', JSON.stringify(goal)) } catch {}
    showToast('היעד עודכן', 'success')
  }

  const selectPlan = (p: 'free' | 'pro' | 'proplus') => {
    setPlan(p)
    try { localStorage.setItem('plan', p) } catch {}
    nav('chat')
  }

  const updateUserName = (name: string) => {
    setUserName(name)
    try { localStorage.setItem('userName', name) } catch {}
    showToast('השם עודכן', 'success')
  }

  const resetApp = () => {
    try { localStorage.clear() } catch {}
    setTransactions(TRANSACTIONS)
    setSavingsGoal(SAVINGS_GOAL)
    setPlan('free')
    setUserName('משתמש')
    setScreen('obWelcome')
    showToast('האפליקציה אופסה', 'info')
  }

  const renderScreen = () => {
    switch (screen) {
      case 'obWelcome': return <ObWelcome nav={nav} />
      case 'obGoal':    return <ObGoal nav={nav} />
      case 'obIncome':  return <ObIncome nav={nav} />
      case 'obPlan':    return <ObPlan nav={nav} onSelectPlan={selectPlan} onPickPlan={setPendingPlan} />
      case 'obTrial':   return <ObTrial nav={nav} onSelectPlan={selectPlan} pendingPlan={pendingPlan} />
      case 'chat':      return <ChatMain nav={nav} transactions={transactions} userName={userName} />
      case 'insights':  return <InsightsMain nav={nav} savingsGoal={savingsGoal} />
      case 'savingsGoal': return <SavingsGoal nav={nav} savingsGoal={savingsGoal} onUpdate={updateGoal} />
      case 'data':      return <DataMain nav={nav} transactions={transactions} savingsGoal={savingsGoal} />
      case 'transactions': return <TransactionsList nav={nav} transactions={transactions} onSelectTx={selectTx} />
      case 'txDetail':  return (
        <TxDetailSheet
          nav={nav}
          selectedTxId={selectedTxId}
          transactions={transactions}
          onDelete={deleteTx}
          onUpdate={updateTx}
          prevScreen={prevScreen}
        />
      )
      case 'addTx':     return <AddTx nav={nav} onSave={addTx} prevScreen={prevScreen} />
      case 'paywall':   return <Paywall nav={nav} onSelectPlan={selectPlan} currentPlan={plan} />
      case 'couples':   return <Couples nav={nav} />
      case 'settings':  return (
        <Settings
          nav={nav}
          plan={plan}
          userName={userName}
          onUpdateName={updateUserName}
          onReset={resetApp}
          onUpgrade={() => nav('paywall')}
        />
      )
      case 'notifications': return <NotificationsScreen nav={nav} prevScreen={prevScreen} />
      default: return <ChatMain nav={nav} transactions={transactions} userName={userName} />
    }
  }

  // v1.2.1 — Two independent shells rendered always. CSS at ≥1024px hides
  // MobileShell and shows DesktopShell. Onboarding always uses the mobile
  // (centered) layout since onboarded state gates the desktop flow anyway.
  // See DESKTOP_REDESIGN.md + globals.css for breakpoint rules.
  const isOnboarding = ['obWelcome', 'obGoal', 'obIncome', 'obPlan', 'obTrial'].includes(screen)

  // Auth loading state — wait for Clerk to initialise
  if (!isLoaded) {
    return (
      <div style={{
        minHeight: '100dvh',
        background: 'linear-gradient(135deg, #FDDDE8 0%, #FFF4F8 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ fontSize: 32, animation: 'spin 1s linear infinite' }}>🐱</div>
      </div>
    )
  }

  // Not signed in — show inline auth prompt
  if (!isSignedIn) {
    return (
      <div style={{
        minHeight: '100dvh',
        background: 'linear-gradient(135deg, #FDDDE8 0%, #FFF4F8 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 24, direction: 'rtl', gap: 24
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #C85A8A, #E8A0C0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(200,90,138,0.3)',
            fontSize: 32,
          }}>🐱</div>
          <h1 style={{ fontFamily: "'Rubik',sans-serif", fontSize: 32, fontWeight: 700, color: '#1F1A15', margin: '0 0 8px' }}>פיני</h1>
          <p style={{ fontFamily: "'Rubik',sans-serif", fontSize: 15, color: '#8A8070', margin: 0 }}>שאל את הכסף שלך כמו חבר</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
          <a href="/sign-in" style={{
            display: 'block', textAlign: 'center', padding: '14px 0',
            background: '#C85A8A', color: '#fff', borderRadius: 14,
            fontFamily: "'Rubik',sans-serif", fontSize: 16, fontWeight: 600,
            textDecoration: 'none', boxShadow: '0 4px 16px rgba(200,90,138,0.35)'
          }}>התחבר</a>
          <a href="/sign-up" style={{
            display: 'block', textAlign: 'center', padding: '14px 0',
            background: 'rgba(255,255,255,0.8)', color: '#C85A8A', borderRadius: 14,
            fontFamily: "'Rubik',sans-serif", fontSize: 16, fontWeight: 600,
            textDecoration: 'none', border: '1.5px solid rgba(200,90,138,0.3)'
          }}>הרשמה חינם — 7 ימי ניסיון 🎉</a>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* MobileShell — visible <1024px (or during onboarding at any width) */}
      <main
        className={isOnboarding ? 'fini-shell fini-shell--onboarding' : 'fini-shell'}
      >
        <div className="fini-shell__phone">
          <div className="fini-shell__main-inner">
            {hydrated ? (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={screen}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
                >
                  {renderScreen()}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#F7F5E8',
                  fontFamily: "'Rubik', system-ui, sans-serif",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: '#1F1A15',
                    color: '#F7F5E8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: -0.5,
                  }}
                >
                  F
                </div>
              </div>
            )}
          </div>
          <Toast toast={toast} onDismiss={dismissToast} />
        </div>
      </main>

      {/* DesktopShell — visible ≥1024px, skipped during onboarding */}
      {hydrated && !isOnboarding && (
        <DesktopShell
          screen={screen}
          nav={nav}
          transactions={transactions}
          savingsGoal={savingsGoal}
          selectedTxId={selectedTxId}
          prevScreen={prevScreen}
          plan={plan}
          userName={userName}
          onAddTx={addTx}
          onDeleteTx={deleteTx}
          onUpdateTx={updateTx}
          onUpdateGoal={updateGoal}
          onSelectPlan={selectPlan}
          onUpdateUserName={updateUserName}
          onReset={resetApp}
          onSelectTx={selectTx}
        />
      )}
    </>
  )
}
