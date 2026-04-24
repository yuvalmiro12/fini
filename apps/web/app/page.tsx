'use client'
import React, { useState, useEffect, useRef } from 'react'
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
  const [screen, setScreen] = useState<Screen>('obWelcome')
  const [prevScreen, setPrevScreen] = useState<Screen>('data')
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS)
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null)
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoalType>(SAVINGS_GOAL)
  const [plan, setPlan] = useState<'free' | 'pro' | 'proplus'>('free')
  const [pendingPlan, setPendingPlan] = useState<'free' | 'pro' | 'proplus'>('pro')
  const [userName, setUserName] = useState('נועה')
  const [hydrated, setHydrated] = useState(false)
  const [toast, setToast] = useState<ToastData | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    setUserName('נועה')
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

  return (
    <>
      {/* MobileShell — visible <1024px (or during onboarding at any width) */}
      <main
        className={isOnboarding ? 'fini-shell fini-shell--onboarding' : 'fini-shell'}
      >
        <div className="fini-shell__phone">
          <div className="fini-shell__main-inner">
            {hydrated ? (
              renderScreen()
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
