import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Line, Circle, Text as SvgText, G } from 'react-native-svg';
import Icon from '@/components/ui/Icon';
import CatIcon from '@/components/ui/CatIcon';
import { TOKENS } from '@/lib/tokens';
import { SEED_TRANSACTIONS, SEED_MONTHLY_DATA } from '@/lib/seed';

const SCREEN_W = Dimensions.get('window').width;
const CHART_W = SCREEN_W - 48;
const CHART_H = 140;

function LineChart() {
  const data = SEED_MONTHLY_DATA;
  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expense]));
  const stepX = CHART_W / (data.length - 1);

  const toY = (v: number) => CHART_H - (v / maxVal) * (CHART_H - 16) - 4;
  const toX = (i: number) => i * stepX;

  const incPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d.income)}`)
    .join(' ');
  const expPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d.expense)}`)
    .join(' ');

  return (
    <Svg width={CHART_W} height={CHART_H + 24}>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <Line
          key={f}
          x1={0}
          y1={toY(maxVal * f)}
          x2={CHART_W}
          y2={toY(maxVal * f)}
          stroke="rgba(31,26,21,0.06)"
          strokeWidth="1"
        />
      ))}

      {/* Income line */}
      <Path
        d={incPath}
        stroke={TOKENS.income}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Expense line */}
      <Path
        d={expPath}
        stroke={TOKENS.expense}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Month labels */}
      {data.map((d, i) => (
        <SvgText
          key={d.month}
          x={toX(i)}
          y={CHART_H + 16}
          fontSize="10"
          fill={TOKENS.inkMute}
          textAnchor="middle"
          fontFamily={TOKENS.fontRegular}
        >
          {d.month}
        </SvgText>
      ))}

      {/* Last data points */}
      <Circle cx={toX(data.length - 1)} cy={toY(data[data.length - 1].income)} r="4" fill={TOKENS.income} />
      <Circle cx={toX(data.length - 1)} cy={toY(data[data.length - 1].expense)} r="4" fill={TOKENS.expense} />
    </Svg>
  );
}

function BalanceHero() {
  const totalIncome = SEED_TRANSACTIONS
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = SEED_TRANSACTIONS
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const incPct = totalIncome > 0 ? (totalIncome / (totalIncome + totalExpense)) * 100 : 50;

  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceLabel}>יתרה נוכחית</Text>
      <Text style={styles.balanceAmount}>₪{balance.toLocaleString()}</Text>

      {/* Split bar */}
      <View style={styles.splitBar}>
        <View style={[styles.splitIncome, { flex: incPct }]} />
        <View style={[styles.splitExpense, { flex: 100 - incPct }]} />
      </View>

      <View style={styles.splitLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: TOKENS.expense }]} />
          <Text style={styles.legendText}>הוצאות ₪{totalExpense.toLocaleString()}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: TOKENS.income }]} />
          <Text style={styles.legendText}>הכנסות ₪{totalIncome.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
}

function CategoryBreakdown() {
  // Aggregate by category
  const expenses = SEED_TRANSACTIONS.filter((t) => t.type === 'expense');
  const byCategory: Record<string, number> = {};
  expenses.forEach((t) => {
    byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount;
  });
  const total = Object.values(byCategory).reduce((s, v) => s + v, 0);
  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <View style={styles.categoryCard}>
      <Text style={styles.cardTitle}>פירוט לפי קטגוריה</Text>
      {sorted.map(([cat, amount]) => {
        const pct = total > 0 ? amount / total : 0;
        return (
          <View key={cat} style={styles.catRow}>
            <Text style={styles.catPct}>{Math.round(pct * 100)}%</Text>
            <View style={styles.catBarWrap}>
              <View style={[styles.catBar, { width: `${Math.round(pct * 100)}%` }]} />
            </View>
            <View style={styles.catLeft}>
              <Text style={styles.catAmount}>₪{amount.toLocaleString()}</Text>
              <CatIcon catId={cat} size={32} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default function DataScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.filterBtn}>
          <Icon name="filter" size={18} color={TOKENS.inkSoft} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>נתונים</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Icon name="calendar" size={18} color={TOKENS.inkSoft} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 88 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance hero */}
        <BalanceHero />

        {/* Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: TOKENS.expense }]} />
                <Text style={styles.legendText}>הוצאות</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: TOKENS.income }]} />
                <Text style={styles.legendText}>הכנסות</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>6 חודשים אחרונים</Text>
          </View>
          <LineChart />
        </View>

        {/* Two-up cards */}
        <View style={styles.twoUp}>
          <View style={[styles.miniCard, { backgroundColor: TOKENS.mint }]}>
            <Icon name="income" size={20} color={TOKENS.income} />
            <Text style={styles.miniCardValue}>₪14,500</Text>
            <Text style={styles.miniCardLabel}>הכנסות החודש</Text>
          </View>
          <View style={[styles.miniCard, { backgroundColor: TOKENS.rose }]}>
            <Icon name="expense" size={20} color={TOKENS.expense} />
            <Text style={styles.miniCardValue}>₪5,661</Text>
            <Text style={styles.miniCardLabel}>הוצאות החודש</Text>
          </View>
        </View>

        {/* Category breakdown */}
        <CategoryBreakdown />

        {/* Recent transactions */}
        <View style={styles.txCard}>
          <Text style={styles.cardTitle}>עסקאות אחרונות</Text>
          {SEED_TRANSACTIONS.slice(0, 5).map((tx) => (
            <TouchableOpacity key={tx.id} style={styles.txRow} activeOpacity={0.7}>
              <Text
                style={[
                  styles.txAmount,
                  { color: tx.type === 'income' ? TOKENS.income : TOKENS.expense },
                ]}
              >
                {tx.type === 'income' ? '+' : '-'}₪{tx.amount.toLocaleString()}
              </Text>
              <View style={styles.txInfo}>
                <Text style={styles.txMerchant}>{tx.merchant}</Text>
                <Text style={styles.txDate}>
                  {new Date(tx.date).toLocaleDateString('he-IL')}
                </Text>
              </View>
              <CatIcon catId={tx.category} size={36} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TOKENS.lavender,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(232,236,255,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(90,111,184,0.1)',
  },
  headerTitle: {
    fontFamily: TOKENS.fontBold,
    fontSize: 20,
    color: TOKENS.ink,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(90,111,184,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  balanceCard: {
    backgroundColor: TOKENS.blue,
    borderRadius: 20,
    padding: 20,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: TOKENS.blue,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  balanceLabel: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  balanceAmount: {
    fontFamily: TOKENS.fontBold,
    fontSize: 34,
    color: 'white',
    textAlign: 'right',
  },
  splitBar: {
    height: 8,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  splitIncome: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  splitExpense: {
    backgroundColor: 'rgba(212,112,112,0.6)',
  },
  splitLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#1F1A15',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
    }),
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartLegend: {
    flexDirection: 'row',
    gap: 12,
  },
  cardTitle: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 15,
    color: TOKENS.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  twoUp: {
    flexDirection: 'row',
    gap: 10,
  },
  miniCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#1F1A15',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  miniCardValue: {
    fontFamily: TOKENS.fontBold,
    fontSize: 20,
    color: TOKENS.ink,
    textAlign: 'right',
  },
  miniCardLabel: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 12,
    color: TOKENS.inkMute,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#1F1A15',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
    }),
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 100,
    justifyContent: 'flex-end',
  },
  catBarWrap: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: TOKENS.creamDark,
    flexDirection: 'row-reverse',
  },
  catBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: TOKENS.blue,
  },
  catAmount: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 13,
    color: TOKENS.inkSoft,
    textAlign: 'right',
  },
  catPct: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 11,
    color: TOKENS.inkMute,
    width: 30,
    textAlign: 'left',
  },
  txCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#1F1A15',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
    }),
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.creamDark,
  },
  txInfo: {
    flex: 1,
    gap: 2,
  },
  txMerchant: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 14,
    color: TOKENS.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  txDate: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 12,
    color: TOKENS.inkMute,
    textAlign: 'right',
  },
  txAmount: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 15,
    minWidth: 80,
    textAlign: 'right',
  },
});
