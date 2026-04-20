import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import CatIcon from '@/components/ui/CatIcon';
import { TOKENS } from '@/lib/tokens';
import { SEED_SAVINGS, SEED_INSIGHTS } from '@/lib/seed';

function SavingsHeroCard() {
  const router = useRouter();
  const goal = SEED_SAVINGS[0];
  const progress = goal.saved / goal.target;

  return (
    <TouchableOpacity
      style={styles.savingsCard}
      activeOpacity={0.85}
      onPress={() => router.push('/(modals)/savings')}
    >
      <View style={styles.savingsCardTop}>
        <View>
          <Text style={styles.savingsCardLabel}>{goal.label}</Text>
          <Text style={styles.savingsCardEmoji}>{goal.emoji}</Text>
        </View>
        <View style={styles.savingsCardAmounts}>
          <Text style={styles.savingsCardSaved}>
            ₪{goal.saved.toLocaleString()}
          </Text>
          <Text style={styles.savingsCardTarget}>
            מתוך ₪{goal.target.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Progress bar — RTL: full width from right */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>
      <View style={styles.savingsCardFooter}>
        <Text style={styles.savingsCardPct}>
          {Math.round(progress * 100)}% הושג
        </Text>
        {goal.deadline && (
          <Text style={styles.savingsCardDeadline}>
            יעד: {new Date(goal.deadline).toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

function InsightRow({
  title,
  subtitle,
  type,
  icon,
}: {
  title: string;
  subtitle: string;
  type: 'warning' | 'tip' | 'achievement';
  icon: string;
}) {
  const typeConfig = {
    warning: { bg: TOKENS.goldTint, accent: TOKENS.gold, iconBg: '#F3E7C7' },
    tip: { bg: TOKENS.lavender, accent: TOKENS.blue, iconBg: TOKENS.lavenderDeep },
    achievement: { bg: TOKENS.mint, accent: TOKENS.green, iconBg: TOKENS.mintDeep },
  };
  const cfg = typeConfig[type];

  return (
    <TouchableOpacity
      style={[styles.insightRow, { backgroundColor: cfg.bg }]}
      activeOpacity={0.75}
    >
      <Icon name="chevronLeft" size={16} color={cfg.accent} />
      <View style={styles.insightRowText}>
        <Text style={[styles.insightRowTitle, { color: TOKENS.ink }]}>{title}</Text>
        <Text style={[styles.insightRowSubtitle]}>{subtitle}</Text>
      </View>
      <View style={[styles.insightRowIcon, { backgroundColor: cfg.iconBg }]}>
        <Icon name={icon} size={20} color={cfg.accent} />
      </View>
    </TouchableOpacity>
  );
}

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.bellBtn}>
          <Icon name="bell" size={20} color={TOKENS.inkSoft} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>שלום, משתמש 👋</Text>
          <Text style={styles.title}>התובנות שלך</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 88 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Savings Hero */}
        <Text style={styles.sectionTitle}>יעד חיסכון</Text>
        <SavingsHeroCard />

        {/* All savings */}
        <View style={styles.savingsRow}>
          {SEED_SAVINGS.slice(1).map((sg) => {
            const pct = sg.saved / sg.target;
            return (
              <TouchableOpacity
                key={sg.id}
                style={[styles.savingsMini, { backgroundColor: sg.tint }]}
                activeOpacity={0.75}
              >
                <Text style={styles.savingsMiniEmoji}>{sg.emoji}</Text>
                <Text style={styles.savingsMiniLabel}>{sg.label}</Text>
                <View style={styles.progressBgSm}>
                  <View style={[styles.progressFillSm, { width: `${Math.round(pct * 100)}%`, backgroundColor: sg.color }]} />
                </View>
                <Text style={[styles.savingsMiniPct, { color: sg.color }]}>
                  {Math.round(pct * 100)}%
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Insights */}
        <Text style={styles.sectionTitle}>תובנות החודש</Text>
        <View style={styles.insightsList}>
          {SEED_INSIGHTS.map((ins) => (
            <InsightRow
              key={ins.id}
              title={ins.title}
              subtitle={ins.subtitle}
              type={ins.type}
              icon={ins.icon}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TOKENS.mint,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(214,238,224,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(91,142,111,0.1)',
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(91,142,111,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  greeting: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 13,
    color: TOKENS.inkMute,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  title: {
    fontFamily: TOKENS.fontBold,
    fontSize: 22,
    color: TOKENS.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 16,
    color: TOKENS.inkSoft,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 4,
    marginTop: 8,
  },
  savingsCard: {
    backgroundColor: TOKENS.green,
    borderRadius: 20,
    padding: 18,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: TOKENS.green,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  savingsCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  savingsCardLabel: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 18,
    color: 'white',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  savingsCardEmoji: {
    fontSize: 28,
    marginTop: 4,
  },
  savingsCardAmounts: {
    alignItems: 'flex-end',
  },
  savingsCardSaved: {
    fontFamily: TOKENS.fontBold,
    fontSize: 26,
    color: 'white',
    textAlign: 'right',
  },
  savingsCardTarget: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'right',
  },
  progressBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    flexDirection: 'row-reverse',
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  savingsCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  savingsCardPct: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  savingsCardDeadline: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  savingsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  savingsMini: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#1F1A15',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  savingsMiniEmoji: {
    fontSize: 22,
  },
  savingsMiniLabel: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 12,
    color: TOKENS.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  progressBgSm: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(31,26,21,0.1)',
    flexDirection: 'row-reverse',
  },
  progressFillSm: {
    height: 4,
    borderRadius: 2,
  },
  savingsMiniPct: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 13,
    textAlign: 'right',
  },
  insightsList: {
    gap: 8,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
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
  insightRowIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightRowText: {
    flex: 1,
    gap: 2,
  },
  insightRowTitle: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  insightRowSubtitle: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 12,
    color: TOKENS.inkMute,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
