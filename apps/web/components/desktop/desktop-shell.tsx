'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './sidebar'
import { TopBar } from './top-bar'
import { ChatDrawer } from './chat-drawer'
import { DashboardDesktop } from './dashboard'
import { TransactionsDesktop } from './transactions'
import { InsightsDesktop } from './insights'
import { SavingsGoalDesktop } from './savings-goal'
import { SettingsDesktop } from './settings'
import { PaywallDesktop } from './paywall'
import { CouplesDesktop } from './couples'
import { NotificationsDesktop } from './notifications'
import { AddTxDesktop } from './add-tx'
import { TxDetailDesktop } from './tx-detail'
import type { Transaction, SavingsGoal as SavingsGoalType } from '../../lib/seed'

/**
 * DesktopShell — desktop-only layout (≥1024px).
 * Hidden at <1024px via `.fini-desktop-shell { display: none }` in globals.css.
 *
 * Grid structure (RTL):
 *   ┌──────────────┬───────────┐
 *   │              │  Sidebar  │   240px
 *   │    Main      ├───────────┤
 *   │  (TopBar +   │           │
 *   │   screen)    │           │
 *   └──────────────┴───────────┘
 *       1fr            240px
 *
 * v1.3 — all screens promoted to dedicated desktop layouts.
 * No more `card()` fallback wrapping mobile components.
 */

interface Props {
  screen: string
  nav: (s: string) => void
  transactions: Transaction[]
  savingsGoal: SavingsGoalType
  selectedTxId: string | null
  prevScreen: string
  plan: 'free' | 'pro' | 'proplus'
  userName: string
  onAddTx: (tx: Transaction) => void
  onDeleteTx: (id: string) => void
  onUpdateTx: (tx: Transaction) => void
  onUpdateGoal: (g: SavingsGoalType) => void
  onSelectPlan: (p: 'free' | 'pro' | 'proplus') => void
  onUpdateUserName: (n: string) => void
  onReset: () => void
  onSelectTx: (id: string) => void
}

export function DesktopShell({
  screen,
  nav,
  transactions,
  savingsGoal,
  selectedTxId,
  prevScreen,
  plan,
  userName,
  onAddTx,
  onDeleteTx,
  onUpdateTx,
  onUpdateGoal,
  onSelectPlan,
  onUpdateUserName,
  onReset,
  onSelectTx,
}: Props) {
  const renderMain = () => {
    switch (screen) {
      case 'data':
        return <DashboardDesktop nav={nav} transactions={transactions} savingsGoal={savingsGoal} />
      case 'transactions':
        return <TransactionsDesktop nav={nav} transactions={transactions} onSelectTx={onSelectTx} />
      case 'insights':
        return <InsightsDesktop nav={nav} savingsGoal={savingsGoal} transactions={transactions} />
      case 'savingsGoal':
        return <SavingsGoalDesktop nav={nav} savingsGoal={savingsGoal} onUpdate={onUpdateGoal} />
      case 'txDetail':
        return (
          <TxDetailDesktop
            nav={nav}
            selectedTxId={selectedTxId}
            transactions={transactions}
            onDelete={onDeleteTx}
            onUpdate={onUpdateTx}
            prevScreen={prevScreen}
          />
        )
      case 'addTx':
        return <AddTxDesktop nav={nav} onSave={onAddTx} prevScreen={prevScreen} />
      case 'couples':
        return <CouplesDesktop nav={nav} />
      case 'settings':
        return (
          <SettingsDesktop
            nav={nav}
            plan={plan}
            userName={userName}
            onUpdateName={onUpdateUserName}
            onReset={onReset}
            onUpgrade={() => nav('paywall')}
          />
        )
      case 'paywall':
        return <PaywallDesktop nav={nav} onSelectPlan={onSelectPlan} currentPlan={plan} />
      case 'notifications':
        return <NotificationsDesktop nav={nav} prevScreen={prevScreen} />
      default:
        return <DashboardDesktop nav={nav} transactions={transactions} savingsGoal={savingsGoal} />
    }
  }

  return (
    <div
      className="fini-desktop-shell"
      style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        gridTemplateRows: '1fr',
        minHeight: '100vh',
        background: '#F7F5E8',
        direction: 'rtl',
      }}
    >
      <Sidebar screen={screen} onNav={nav} userName={userName} plan={plan} />

      <main
        style={{
          gridColumn: 2,
          gridRow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          background: '#EFEADA',
          overflow: 'hidden',
        }}
      >
        <TopBar screen={screen} onNav={nav} onAddTx={() => nav('addTx')} />
        <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{ minHeight: '100%' }}
            >
              {renderMain()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <ChatDrawer transactions={transactions} onAddTx={() => nav('addTx')} />
    </div>
  )
}
