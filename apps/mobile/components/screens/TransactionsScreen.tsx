import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import CatIcon from '@/components/ui/CatIcon';
import { TOKENS } from '@/lib/tokens';
import { SEED_TRANSACTIONS, Transaction } from '@/lib/seed';

const FILTERS = ['הכל', 'הכנסות', 'הוצאות', 'אוכל', 'קניות', 'תחבורה'];

function groupByDate(transactions: Transaction[]): { date: string; items: Transaction[] }[] {
  const map: Record<string, Transaction[]> = {};
  transactions.forEach((tx) => {
    if (\!map[tx.date]) map[tx.date] = [];
    map[tx.date].push(tx);
  });
  return Object.entries(map)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({ date, items }));
}

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('הכל');

  const filtered = SEED_TRANSACTIONS.filter((tx) => {
    if (activeFilter === 'הכל') return true;
    if (activeFilter === 'הכנסות') return tx.type === 'income';
    if (activeFilter === 'הוצאות') return tx.type === 'expense';
    return tx.category === activeFilter || tx.category.includes(activeFilter);
  });

  const grouped = groupByDate(filtered);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('he-IL', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Icon name="back" size={20} color={TOKENS.inkSoft} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>עסקאות</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(modals)/add-tx')}>
          <Icon name="add" size={22} color={TOKENS.blue} />
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
        style={styles.filtersScroll}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              activeFilter === f && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === f && styles.filterChipTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Transactions list */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {grouped.map(({ date, items }) => (
          <View key={date} style={styles.group}>
            <Text style={styles.groupDate}>{formatDate(date)}</Text>
            {items.map((tx) => (
              <TouchableOpacity
                key={tx.id}
                style={styles.txRow}
                activeOpacity={0.7}
                onPress={() => router.push('/(modals)/tx-detail')}
              >
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
                  {tx.note && <Text style={styles.txNote}>{tx.note}</Text>}
                </View>
                <CatIcon catId={tx.category} size={40} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TOKENS.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: TOKENS.creamDark,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31,26,21,0.08)',
  },
  headerTitle: {
    fontFamily: TOKENS.fontBold,
    fontSize: 20,
    color: TOKENS.ink,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(31,26,21,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TOKENS.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersScroll: {
    backgroundColor: TOKENS.creamDark,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31,26,21,0.06)',
  },
  filtersContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(31,26,21,0.1)',
  },
  filterChipActive: {
    backgroundColor: TOKENS.blue,
    borderColor: TOKENS.blue,
  },
  filterChipText: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 13,
    color: TOKENS.inkSoft,
    writingDirection: 'rtl',
  },
  filterChipTextActive: {
    color: 'white',
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  group: {
    gap: 4,
  },
  groupDate: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 13,
    color: TOKENS.inkMute,
    textAlign: 'right',
    writingDirection: 'rtl',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 12,
    gap: 10,
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
  txInfo: {
    flex: 1,
    gap: 2,
  },
  txMerchant: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 15,
    color: TOKENS.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  txNote: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 12,
    color: TOKENS.inkMute,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  txAmount: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 15,
    minWidth: 80,
    textAlign: 'right',
  },
});
