import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import CatIcon from '@/components/ui/CatIcon';
import { TOKENS } from '@/lib/tokens';
import { SEED_TRANSACTIONS } from '@/lib/seed';

export default function TxDetailModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Show the first transaction as example
  const tx = SEED_TRANSACTIONS[1];

  const amountColor = tx.type === 'income' ? TOKENS.income : TOKENS.expense;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      {/* Drag indicator */}
      <View style={styles.dragIndicator} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
          <Icon name="trash" size={18} color={TOKENS.expense} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>פרטי עסקה</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Icon name="close" size={20} color={TOKENS.inkSoft} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Amount hero */}
        <View style={styles.amountHero}>
          <CatIcon catId={tx.category} size={56} iconSize={28} />
          <Text style={[styles.amountText, { color: amountColor }]}>
            {tx.type === 'income' ? '+' : '-'}₪{tx.amount.toLocaleString()}
          </Text>
          <Text style={styles.merchantName}>{tx.merchant}</Text>
          <Text style={styles.txDate}>
            {new Date(tx.date).toLocaleDateString('he-IL', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>

        {/* Details card */}
        <View style={styles.detailsCard}>
          <DetailRow label="קטגוריה" value={tx.category} isCat />
          <DetailRow label="סוג" value={tx.type === 'income' ? 'הכנסה' : 'הוצאה'} />
          <DetailRow label="תאריך" value={new Date(tx.date).toLocaleDateString('he-IL')} />
          {tx.note && <DetailRow label="הערה" value={tx.note} />}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => {}}>
            <Icon name="edit" size={18} color={TOKENS.blue} />
            <Text style={styles.editBtnText}>ערוך עסקה</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function DetailRow({
  label,
  value,
  isCat,
}: {
  label: string;
  value: string;
  isCat?: boolean;
}) {
  return (
    <View style={detailStyles.row}>
      <View style={detailStyles.right}>
        {isCat ? (
          <CatIcon catId={value} size={28} />
        ) : (
          <Text style={detailStyles.value}>{value}</Text>
        )}
      </View>
      <Text style={detailStyles.label}>{label}</Text>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.creamDark,
  },
  label: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 14,
    color: TOKENS.inkMute,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  right: {
    alignItems: 'flex-end',
  },
  value: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 15,
    color: TOKENS.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TOKENS.cream,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(31,26,21,0.15)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: TOKENS.fontBold,
    fontSize: 18,
    color: TOKENS.ink,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TOKENS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDDDE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    gap: 20,
    alignItems: 'stretch',
  },
  amountHero: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 24,
    backgroundColor: 'white',
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#1F1A15',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  amountText: {
    fontFamily: TOKENS.fontBold,
    fontSize: 40,
    textAlign: 'center',
  },
  merchantName: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 20,
    color: TOKENS.ink,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  txDate: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 14,
    color: TOKENS.inkMute,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#1F1A15',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  actions: {
    gap: 10,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TOKENS.lavender,
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  editBtnText: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 15,
    color: TOKENS.blue,
    writingDirection: 'rtl',
  },
});
