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
import FiniMascot from '@/components/ui/FiniMascot';
import { TOKENS } from '@/lib/tokens';

const FEATURES = [
  { emoji: '📊', label: 'ניתוח הוצאות מתקדם' },
  { emoji: '🎯', label: 'יעדי חיסכון ללא הגבלה' },
  { emoji: '💑', label: 'מצב זוגי - נהלו יחד' },
  { emoji: '🤖', label: 'המלצות AI מותאמות אישית' },
  { emoji: '📈', label: 'דוחות חודשיים ושנתיים' },
  { emoji: '🔔', label: 'התראות חכמות בזמן אמת' },
];

const PLANS = [
  {
    id: 'monthly',
    label: 'חודשי',
    price: '₪29',
    period: '/חודש',
    badge: null,
  },
  {
    id: 'yearly',
    label: 'שנתי',
    price: '₪199',
    period: '/שנה',
    badge: 'חסוך 43%',
  },
];

export default function PaywallModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = React.useState('yearly');

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      {/* Close */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Icon name="close" size={20} color={TOKENS.inkSoft} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <FiniMascot size={100} />
          <View style={styles.crownWrap}>
            <Icon name="crown" size={24} color={TOKENS.gold} />
          </View>
          <Text style={styles.heroTitle}>פיני פרו</Text>
          <Text style={styles.heroSubtitle}>
            קבל גישה לכל הכלים הפיננסיים{'\n'}המתקדמים שלנו
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresList}>
          {FEATURES.map((f) => (
            <View key={f.label} style={styles.featureRow}>
              <Icon name="check" size={16} color={TOKENS.income} />
              <Text style={styles.featureEmoji}>{f.emoji}</Text>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>

        {/* Plans */}
        <View style={styles.plans}>
          {PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardActive,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
              activeOpacity={0.8}
            >
              {plan.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{plan.badge}</Text>
                </View>
              )}
              <Text
                style={[
                  styles.planLabel,
                  selectedPlan === plan.id && styles.planLabelActive,
                ]}
              >
                {plan.label}
              </Text>
              <View style={styles.planPriceRow}>
                <Text
                  style={[
                    styles.planPeriod,
                    selectedPlan === plan.id && styles.planPeriodActive,
                  ]}
                >
                  {plan.period}
                </Text>
                <Text
                  style={[
                    styles.planPrice,
                    selectedPlan === plan.id && styles.planPriceActive,
                  ]}
                >
                  {plan.price}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnText}>התחל ניסיון חינם 7 ימים</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          ניתן לבטל בכל עת. ללא חיוב בתקופת הניסיון.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TOKENS.goldTint,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(201,162,77,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  content: {
    padding: 24,
    gap: 20,
    alignItems: 'stretch',
  },
  hero: {
    alignItems: 'center',
    paddingTop: 20,
    gap: 10,
    position: 'relative',
  },
  crownWrap: {
    position: 'absolute',
    top: 0,
    right: '35%',
  },
  heroTitle: {
    fontFamily: TOKENS.fontBold,
    fontSize: 32,
    color: TOKENS.ink,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  heroSubtitle: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 16,
    color: TOKENS.inkSoft,
    textAlign: 'center',
    writingDirection: 'rtl',
    lineHeight: 24,
  },
  featuresList: {
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
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureEmoji: {
    fontSize: 18,
  },
  featureLabel: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 15,
    color: TOKENS.ink,
    flex: 1,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  plans: {
    flexDirection: 'row',
    gap: 12,
  },
  planCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 6,
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
  planCardActive: {
    borderColor: TOKENS.gold,
    backgroundColor: '#FFFBF0',
  },
  badge: {
    backgroundColor: TOKENS.gold,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 11,
    color: 'white',
  },
  planLabel: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 14,
    color: TOKENS.inkMute,
    writingDirection: 'rtl',
  },
  planLabelActive: {
    color: TOKENS.gold,
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  planPrice: {
    fontFamily: TOKENS.fontBold,
    fontSize: 24,
    color: TOKENS.ink,
  },
  planPriceActive: {
    color: TOKENS.gold,
  },
  planPeriod: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 12,
    color: TOKENS.inkMute,
  },
  planPeriodActive: {
    color: TOKENS.gold,
  },
  ctaBtn: {
    backgroundColor: TOKENS.gold,
    borderRadius: 28,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: TOKENS.gold,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  ctaBtnText: {
    fontFamily: TOKENS.fontBold,
    fontSize: 17,
    color: 'white',
    writingDirection: 'rtl',
  },
  disclaimer: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 12,
    color: TOKENS.inkMute,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});
