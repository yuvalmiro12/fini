import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import FiniMascot from '@/components/ui/FiniMascot';
import { TOKENS } from '@/lib/tokens';

interface OnboardingProps {
  onNext: () => void;
  onBack?: () => void;
  step: number;
  totalSteps: number;
}

function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <View style={dotStyles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[dotStyles.dot, i === step && dotStyles.dotActive]}
        />
      ))}
    </View>
  );
}

const dotStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(200,90,138,0.2)',
  },
  dotActive: {
    width: 24,
    backgroundColor: TOKENS.pink,
  },
});

export function OBWelcome({ onNext, step, totalSteps }: OnboardingProps) {
  return (
    <View style={styles.root}>
      <View style={styles.center}>
        <FiniMascot size={160} wave />
        <Text style={styles.headline}>שלום, אני פיני\! 👋</Text>
        <Text style={styles.subtitle}>
          העוזר הפיננסי החכם שלך.{'\n'}
          אני אעזור לך לנהל את הכסף{'\n'}
          בקלות ובחכמה.
        </Text>
      </View>

      <View style={styles.bottom}>
        <StepDots step={step} total={totalSteps} />
        <TouchableOpacity style={styles.primaryBtn} onPress={onNext} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>בוא נתחיל\!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const GOALS = [
  { id: 'save', emoji: '💰', label: 'לחסוך יותר' },
  { id: 'track', emoji: '📊', label: 'לעקוב אחר הוצאות' },
  { id: 'debt', emoji: '📉', label: 'לצמצם חובות' },
  { id: 'invest', emoji: '📈', label: 'להשקיע בעתיד' },
  { id: 'budget', emoji: '🎯', label: 'לנהל תקציב' },
  { id: 'goals', emoji: '🏖️', label: 'להגיע ליעד חיסכון' },
];

export function OBGoal({ onNext, onBack, step, totalSteps }: OnboardingProps) {
  const [selected, setSelected] = React.useState<string | null>(null);

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>חזור</Text>
        </TouchableOpacity>
        <Text style={styles.stepLabel}>שלב {step + 1}/{totalSteps}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FiniMascot size={100} />
        <Text style={styles.headline}>מה המטרה שלך?</Text>
        <Text style={styles.subtitle}>בחר את המטרה הפיננסית העיקרית שלך</Text>

        <View style={styles.goalGrid}>
          {GOALS.map((g) => (
            <TouchableOpacity
              key={g.id}
              style={[
                styles.goalCard,
                selected === g.id && styles.goalCardSelected,
              ]}
              onPress={() => setSelected(g.id)}
              activeOpacity={0.75}
            >
              <Text style={styles.goalEmoji}>{g.emoji}</Text>
              <Text
                style={[
                  styles.goalLabel,
                  selected === g.id && styles.goalLabelSelected,
                ]}
              >
                {g.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <StepDots step={step} total={totalSteps} />
        <TouchableOpacity
          style={[styles.primaryBtn, \!selected && styles.primaryBtnDisabled]}
          onPress={selected ? onNext : undefined}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>המשך</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function OBIncome({ onNext, onBack, step, totalSteps }: OnboardingProps) {
  const [selected, setSelected] = React.useState<string | null>(null);

  const RANGES = [
    { id: 'lt5k', label: 'עד ₪5,000' },
    { id: '5k10k', label: '₪5,000 – ₪10,000' },
    { id: '10k15k', label: '₪10,000 – ₪15,000' },
    { id: '15k25k', label: '₪15,000 – ₪25,000' },
    { id: 'gt25k', label: 'מעל ₪25,000' },
  ];

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>חזור</Text>
        </TouchableOpacity>
        <Text style={styles.stepLabel}>שלב {step + 1}/{totalSteps}</Text>
      </View>

      <View style={styles.center}>
        <FiniMascot size={100} />
        <Text style={styles.headline}>מה ההכנסה החודשית שלך?</Text>
        <Text style={styles.subtitle}>
          המידע הזה יעזור לי להציע לך המלצות מדויקות
        </Text>

        <View style={styles.rangeList}>
          {RANGES.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={[
                styles.rangeRow,
                selected === r.id && styles.rangeRowSelected,
              ]}
              onPress={() => setSelected(r.id)}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.radioOuter,
                  selected === r.id && styles.radioOuterSelected,
                ]}
              >
                {selected === r.id && <View style={styles.radioInner} />}
              </View>
              <Text
                style={[
                  styles.rangeLabel,
                  selected === r.id && styles.rangeLabelSelected,
                ]}
              >
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.bottom}>
        <StepDots step={step} total={totalSteps} />
        <TouchableOpacity
          style={[styles.primaryBtn, \!selected && styles.primaryBtnDisabled]}
          onPress={selected ? onNext : undefined}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>המשך</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function OBPlan({ onNext, step, totalSteps }: OnboardingProps) {
  return (
    <View style={styles.root}>
      <View style={styles.center}>
        <FiniMascot size={140} />
        <Text style={styles.headline}>הכל מוכן\! 🎉</Text>
        <Text style={styles.subtitle}>
          בניתי לך תוכנית פיננסית מותאמת אישית.{'\n'}
          בוא נתחיל לנהל את הכסף שלך ביחד\!
        </Text>

        <View style={styles.planFeatures}>
          {[
            { emoji: '💬', label: 'צ׳אט עם פיני בעברית' },
            { emoji: '📊', label: 'ניתוח הוצאות חכם' },
            { emoji: '🎯', label: 'מעקב אחר יעדי חיסכון' },
            { emoji: '🔔', label: 'התראות חכמות' },
          ].map((f) => (
            <View key={f.label} style={styles.planFeatureRow}>
              <Text style={styles.planFeatureEmoji}>{f.emoji}</Text>
              <Text style={styles.planFeatureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottom}>
        <StepDots step={step} total={totalSteps} />
        <TouchableOpacity style={styles.primaryBtn} onPress={onNext} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>התחל עם פיני\!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TOKENS.rose,
    paddingHorizontal: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  backText: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 15,
    color: TOKENS.pink,
  },
  stepLabel: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 13,
    color: TOKENS.inkMute,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingTop: 40,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    gap: 16,
  },
  headline: {
    fontFamily: TOKENS.fontBold,
    fontSize: 28,
    color: TOKENS.ink,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  subtitle: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 16,
    color: TOKENS.inkSoft,
    textAlign: 'center',
    writingDirection: 'rtl',
    lineHeight: 24,
  },
  bottom: {
    paddingBottom: 40,
    gap: 0,
  },
  primaryBtn: {
    backgroundColor: TOKENS.pink,
    borderRadius: 28,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: TOKENS.pink,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  primaryBtnDisabled: {
    backgroundColor: 'rgba(200,90,138,0.4)',
  },
  primaryBtnText: {
    fontFamily: TOKENS.fontBold,
    fontSize: 18,
    color: 'white',
    writingDirection: 'rtl',
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginTop: 8,
  },
  goalCard: {
    width: '45%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#1F1A15',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  goalCardSelected: {
    borderColor: TOKENS.pink,
    backgroundColor: '#FFF0F5',
  },
  goalEmoji: {
    fontSize: 28,
  },
  goalLabel: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 13,
    color: TOKENS.inkSoft,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  goalLabelSelected: {
    color: TOKENS.pink,
    fontFamily: TOKENS.fontSemiBold,
  },
  rangeList: {
    width: '100%',
    gap: 10,
    marginTop: 8,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
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
  rangeRowSelected: {
    borderColor: TOKENS.pink,
    backgroundColor: '#FFF0F5',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(31,26,21,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: TOKENS.pink,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: TOKENS.pink,
  },
  rangeLabel: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 15,
    color: TOKENS.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
    flex: 1,
  },
  rangeLabelSelected: {
    color: TOKENS.pink,
  },
  planFeatures: {
    width: '100%',
    gap: 10,
    marginTop: 8,
  },
  planFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  planFeatureEmoji: {
    fontSize: 22,
  },
  planFeatureLabel: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 15,
    color: TOKENS.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
    flex: 1,
  },
});
