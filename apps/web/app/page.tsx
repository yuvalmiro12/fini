'use client'
import React, { useState, useEffect } from 'react'
import { ObWelcome, ObGoal, ObIncome, ObPlan } from '../components/screens/onboarding'
import { ChatMain } from '../components/screens/chat'
import { InsightsMain, SavingsGoal } from '../components/screens/insights'
import { DataMain, TransactionsList } from '../components/screens/data'
import { TxDetailSheet, AddTx, Paywall, Couples } from '../components/screens/sheets'
import { Settings } from '../components/screens/settings'
import { NotificationsScreen } from '../components/screens/notifications'
import { TRANSACTIONS, SAVINGS_GOAL } from '../lib/seed'
import type { Transaction, SavingsGoal as SavingsGoalType } from '../lib/seed'

export type Screen =
  | 'obWelcome' | 'obGoal' | 'obIncome' | 'obPlan'
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
  const [userName, setUserName] = useState('נועה')

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

  const addTx = (tx: Transaction) => saveTxs([tx, ...transactions])

  const deleteTx = (id: string) => {
    saveTxs(transactions.filter(t => t.id !== id))
    nav('transactions')
  }

  const updateTx = (updated: Transaction) => {
    saveTxs(transactions.map(t => t.id === updated.id ? updated : t))
  }

  const selectTx = (id: string) => {
    setSelectedTxId(id)
    nav('txDetail')
  }

  const updateGoal = (goal: SavingsGoalType) => {
    setSavingsGoal(goal)
    try { localStorage.setItem('savingsGoal', JSON.stringify(goal)) } catch {}
  }

  const selectPlan = (p: 'free' | 'pro' | 'proplus') => {
    setPlan(p)
    try { localStorage.setItem('plan', p) } catch {}
    nav('chat')
  }

  const updateUserName = (name: string) => {
    setUserName(name)
    try { localStorage.setItem('userName', name) } catch {}
  }

  const resetApp = () => {
    try { localStorage.clear() } catch {}
    setTransactions(TRANSACTIONS)
    setSavingsGoal(SAVINGS_GOAL)
    setPlan('free')
    setUserName('נועה')
    setScreen('obWelcome')
  }

  const renderScreen = () => {
    switch (screen) {
      case 'obWelcome': return <ObWelcome nav={nav} />
      case 'obGoal':    return <ObGoal nav={nav} />
      case 'obIncome':  return <ObIncome nav={nav} />
      case 'obPlan':    return <ObPlan nav={nav} onSelectPlan={selectPlan} />
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

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', background: '#EFEADA', padding: '0' }}>
      <div style={{ width: '100%', maxWidth: 390, minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F7F5E8', position: 'relative', overflow: 'hidden', boxShadow: '0 0 40px rgba(31,26,21,0.12)' }}>
        {renderScreen()}
      </div>
    </main>
  )
}
