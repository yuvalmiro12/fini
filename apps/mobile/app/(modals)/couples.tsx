import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import { FiniAvatar } from '@/components/ui/FiniMascot';
import { TOKENS } from '@/lib/tokens';
import { SEED_TRANSACTIONS } from '@/lib/seed';

const PARTNER_COLORS = {
  me: TOKENS.pink,
  partner: TOKENS.blue,
};

export default function CouplesModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [inviteEmail, setInviteEmail] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const myExpenses = SEED_TRANSACTIONS
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);
  const partnerExpenses = Math.round(myExpenses * 0.78);
  const total = myExpenses + partnerExpenses;
  const myPct = total > 0 ? (myExpenses / total) * 100 : 50;
  const partnerPct = 100 - myPct;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Icon name="close" size={20} color={TOKENS.inkSoft} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>מצב זוגי 💑</Text>
        <View style={styles.closeBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {isConnected ? (
          <>
            {/* Connected view */}
            <View style={styles.coupleCard}>
              {/* Partners */}
              <View style={styles.partnersRow}>
                <View style={styles.partnerCol}>
                  <View style={[styles.partnerAvatar, { backgroundColor: TOKENS.lavender }]}>
                    <Icon name="heart" size={24} color={TOKENS.blue} />
                  </View>
                  <Text style={[styles.partnerName, { color: TOKENS.blue }]}>שותף</Text>
                  <Text style={[styles.partnerAmount, { color: TOKENS.blue }]}>
                    ₪{partnerExpenses.toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.coupleHeart}>💑</Text>
                <View style={styles.partnerCol}>
                  <FiniAvatar size={52} hasPresence />
                  <Text style={[styles.partnerName, { color: TOKENS.pink }]}>אני</Text>
                  <Text style={[styles.partnerAmount, { color: TOKENS.pink }]}>
                    ₪{myExpenses.toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Split bar */}
              <View style={styles.splitBarWrap}>
                <Text style={styles.splitPct}>{Math.round(partnerPct)}%</Text>
                <View style={styles.splitBar}>
                  <View style={[styles.splitLeft, { flex: myPct, backgroundColor: TOKENS.pink }]} />
                  <View style={[styles.splitRight, { flex: partnerPct, backgroundColor: TOKENS.blue }]} />
                </View>
                <Text style={styles.splitPct}>{Math.round(myPct)}%</Text>
              </View>

              <Text style={styles.totalLabel}>
                סה"כ הוצאות החודש: ₪{total.toLocaleString()}
              </Text>
            </View>

            {/* Shared transactions */}
            <Text style={styles.sectionTitle}>עסקאות משותפות</Text>
            {SEED_TRANSACTIONS.slice(0, 4).map((tx, i) => (
              <View key={tx.id} style={styles.txRow}>
                <Text
                  style={[
                    styles.txOwner,
                    { color: i % 2 === 0 ? TOKENS.pink : TOKENS.blue },
                  ]}
                >
                  {i % 2 === 0 ? 'אני' : 'שותף'}
                </Text>
                <View style={styles.txInfo}>
                  <Text style={styles.txMerchant}>{tx.merchant}</Text>
                  <Text style={styles.txDate}>
                    {new Date(tx.date).toLocaleDateString('he-IL')}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.txAmount,
                    { color: tx.type === 'income' ? TOKENS.income : TOKENS.expense },
                  ]}
                >
                  ₪{tx.amount.toLocaleString()}
                </Text>
              </View>
            ))}
          </>
        ) : (
          <>
            {/* Invite view */}
            <View style={styles.inviteHero}>
              <Text style={styles.inviteEmoji}>💑</Text>
              <Text style={styles.inviteTitle}>נהלו כסף ביחד</Text>
              <Text style={styles.inviteSubtitle}>
                הזמינו את השותף שלכם ותוכלו לראות{'\n'}
                הוצאות, יעדים ותובנות יחד
              </Text>
            </View>

            <View style={styles.inviteCard}>
              <Text style={styles.inviteLabel}>הזמן שותף באימייל</Text>
              <TextInput
                style={styles.inviteInput}
                value={inviteEmail}
                onChangeText={setInviteEmail}
                placeholder="כתובת אימייל"
                placeholderTextColor={TOKENS.inkMute}
                keyboardType="email-address"
                textAlign="right"
                writingDirection="rtl"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={[
                  styles.inviteBtn,
                  \!inviteEmail && styles.inviteBtnDisabled,
                ]}
                onPress={() => inviteEmail && setIsConnected(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.inviteBtnText}>שלח הזמנה</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.featuresCard}>
              {[
                { emoji: '📊', text: 'ראו הוצאות של שניכם יחד' },
                { emoji: '🎯', text: 'שתפו יעדי חיסכון' },
                { emoji: '🔔', text: 'קבלו התראות על הוצאות גדולות' },
                { emoji: '📈', text: 'דוחות זוגיים חודשיים' },
              ].map((f) => (
                <View key={f.text} style={styles.featureRow}>
                  <Text style={styles.featureEmoji}>{f.emoji}</Text>
                  <Text style={styles.featureText}>{f.text}</Text>
                  <Icon name="check" size={16} color={TOKENS.income} />
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TOKENS.rose,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
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
    backgroundColor: 'rgba(200,90,138,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
    gap: 14,
  },
  coupleCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: TOKENS.pink,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 14,
      },
      android: { elevation: 4 },
    }),
  },
  partnersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partnerCol: {
    alignItems: 'center',
    gap: 6,
  },
  partnerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerName: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 14,
    writingDirection: 'rtl',
  },
  partnerAmount: {
    fontFamily: TOKENS.fontBold,
    fontSize: 18,
  },
  coupleHeart: {
    fontSize: 32,
  },
  splitBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  splitBar: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  splitLeft: {
    height: 10,
  },
  splitRight: {
    height: 10,
  },
  splitPct: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 12,
    color: TOKENS.inkMute,
    minWidth: 28,
    textAlign: 'center',
  },
  totalLabel: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 14,
    color: TOKENS.inkSoft,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  sectionTitle: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 15,
    color: TOKENS.inkSoft,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 4,
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
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: { elevation: 1 },
    }),
  },
  txOwner: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 12,
    minWidth: 40,
    textAlign: 'right',
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
    fontSize: 11,
    color: TOKENS.inkMute,
    textAlign: 'right',
  },
  txAmount: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 14,
    minWidth: 70,
    textAlign: 'right',
  },
  inviteHero: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  inviteEmoji: {
    fontSize: 64,
  },
  inviteTitle: {
    fontFamily: TOKENS.fontBold,
    fontSize: 26,
    color: TOKENS.ink,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  inviteSubtitle: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 15,
    color: TOKENS.inkSoft,
    textAlign: 'center',
    writingDirection: 'rtl',
    lineHeight: 22,
  },
  inviteCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: TOKENS.pink,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
    }),
  },
  inviteLabel: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 15,
    color: TOKENS.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  inviteInput: {
    height: 48,
    backgroundColor: TOKENS.rose,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontFamily: TOKENS.fontRegular,
    fontSize: 15,
    color: TOKENS.ink,
    borderWidth: 1,
    borderColor: 'rgba(200,90,138,0.2)',
  },
  inviteBtn: {
    backgroundColor: TOKENS.pink,
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: TOKENS.pink,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  inviteBtnDisabled: {
    backgroundColor: 'rgba(200,90,138,0.35)',
  },
  inviteBtnText: {
    fontFamily: TOKENS.fontBold,
    fontSize: 16,
    color: 'white',
    writingDirection: 'rtl',
  },
  featuresCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    gap: 12,
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
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureEmoji: {
    fontSize: 20,
  },
  featureText: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 14,
    color: TOKENS.ink,
    flex: 1,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
