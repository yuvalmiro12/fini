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
import Svg, { Circle, Path } from 'react-native-svg';
import Icon from '@/components/ui/Icon';
import { TOKENS } from '@/lib/tokens';
import { SEED_SAVINGS } from '@/lib/seed';

function CircleProgress({
  progress,
  size = 140,
  color,
}: {
  progress: number;
  size?: number;
  color: string;
}) {
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference * (1 - Math.min(progress, 1));
  const cx = size / 2;
  const cy = size / 2;

  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
      <Circle
        cx={cx}
        cy={cy}
        r={r}
        stroke="rgba(31,26,21,0.08)"
        strokeWidth="10"
        fill="none"
      />
      <Circle
        cx={cx}
        cy={cy}
        r={r}
        stroke={color}
        strokeWidth="10"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default function SavingsModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const goal = SEED_SAVINGS[0];
  const progress = goal.saved / goal.target;
  const [depositAmount, setDepositAmount] = useState('');

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Icon name="close" size={20} color={TOKENS.inkSoft} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>יעד חיסכון</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Icon name="edit" size={18} color={TOKENS.blue} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Goal hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroCenter}>
            <CircleProgress
              progress={progress}
              size={160}
              color={goal.color}
            />
            <View style={styles.heroInner}>
              <Text style={styles.heroEmoji}>{goal.emoji}</Text>
              <Text style={[styles.heroPct, { color: goal.color }]}>
                {Math.round(progress * 100)}%
              </Text>
            </View>
          </View>

          <Text style={styles.heroLabel}>{goal.label}</Text>

          <View style={styles.heroAmounts}>
            <View style={styles.heroAmountCol}>
              <Text style={styles.heroAmountLabel}>חסכת</Text>
              <Text style={[styles.heroAmountValue, { color: goal.color }]}>
                ₪{goal.saved.toLocaleString()}
              </Text>
            </View>
            <View style={styles.heroAmountDivider} />
            <View style={styles.heroAmountCol}>
              <Text style={styles.heroAmountLabel}>יעד</Text>
              <Text style={styles.heroAmountValue}>
                ₪{goal.target.toLocaleString()}
              </Text>
            </View>
            <View style={styles.heroAmountDivider} />
            <View style={styles.heroAmountCol}>
              <Text style={styles.heroAmountLabel}>נותר</Text>
              <Text style={[styles.heroAmountValue, { color: TOKENS.expense }]}>
                ₪{(goal.target - goal.saved).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Deadline */}
        {goal.deadline && (
          <View style={styles.deadlineCard}>
            <Icon name="calendar" size={18} color={goal.color} />
            <Text style={styles.deadlineText}>
              יעד להגיע עד:{' '}
              {new Date(goal.deadline).toLocaleDateString('he-IL', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>
        )}

        {/* Deposit */}
        <View style={styles.depositCard}>
          <Text style={styles.depositTitle}>הוסף הפקדה</Text>
          <View style={styles.depositRow}>
            <TouchableOpacity
              style={[styles.depositBtn, { backgroundColor: goal.color }]}
              onPress={() => {}}
              activeOpacity={0.85}
            >
              <Text style={styles.depositBtnText}>הפקד</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.depositInput}
              value={depositAmount}
              onChangeText={setDepositAmount}
              placeholder="סכום בשקלים"
              placeholderTextColor={TOKENS.inkMute}
              keyboardType="numeric"
              textAlign="right"
            />
          </View>
        </View>

        {/* Other goals */}
        <Text style={styles.sectionLabel}>יעדים נוספים</Text>
        {SEED_SAVINGS.slice(1).map((sg) => {
          const pct = sg.saved / sg.target;
          return (
            <TouchableOpacity key={sg.id} style={styles.goalRow} activeOpacity={0.75}>
              <Icon name="chevronLeft" size={16} color={TOKENS.inkMute} />
              <View style={styles.goalRowRight}>
                <View style={styles.goalRowTop}>
                  <Text style={[styles.goalRowPct, { color: sg.color }]}>
                    {Math.round(pct * 100)}%
                  </Text>
                  <View style={styles.goalRowBar}>
                    <View
                      style={[
                        styles.goalRowFill,
                        {
                          width: `${Math.round(pct * 100)}%`,
                          backgroundColor: sg.color,
                        },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.goalRowInfo}>
                  <Text style={styles.goalRowAmount}>
                    ₪{sg.saved.toLocaleString()} / ₪{sg.target.toLocaleString()}
                  </Text>
                  <Text style={styles.goalRowLabel}>{sg.label}</Text>
                  <Text style={styles.goalRowEmoji}>{sg.emoji}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Add new goal */}
        <TouchableOpacity style={styles.addGoalBtn}>
          <Icon name="add" size={20} color={TOKENS.blue} />
          <Text style={styles.addGoalText}>הוסף יעד חיסכון חדש</Text>
        </TouchableOpacity>
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
    backgroundColor: TOKENS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TOKENS.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
    gap: 14,
  },
  heroCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#1F1A15',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
      },
      android: { elevation: 4 },
    }),
  },
  heroCenter: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroInner: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 32,
  },
  heroPct: {
    fontFamily: TOKENS.fontBold,
    fontSize: 24,
    textAlign: 'center',
  },
  heroLabel: {
    fontFamily: TOKENS.fontBold,
    fontSize: 22,
    color: TOKENS.ink,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  heroAmounts: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  heroAmountCol: {
    alignItems: 'center',
    gap: 4,
  },
  heroAmountDivider: {
    width: 1,
    height: '80%',
    backgroundColor: TOKENS.creamDark,
    alignSelf: 'center',
  },
  heroAmountLabel: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 12,
    color: TOKENS.inkMute,
    writingDirection: 'rtl',
  },
  heroAmountValue: {
    fontFamily: TOKENS.fontBold,
    fontSize: 18,
    color: TOKENS.ink,
  },
  deadlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: TOKENS.mint,
    borderRadius: 14,
    padding: 12,
  },
  deadlineText: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 14,
    color: TOKENS.inkSoft,
    textAlign: 'right',
    writingDirection: 'rtl',
    flex: 1,
  },
  depositCard: {
    backgroundColor: 'white',
    borderRadius: 18,
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
  depositTitle: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 15,
    color: TOKENS.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  depositRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  depositInput: {
    flex: 1,
    height: 44,
    backgroundColor: TOKENS.cream,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontFamily: TOKENS.fontRegular,
    fontSize: 16,
    color: TOKENS.ink,
    borderWidth: 1,
    borderColor: TOKENS.creamDark,
  },
  depositBtn: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  depositBtnText: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 15,
    color: 'white',
    writingDirection: 'rtl',
  },
  sectionLabel: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 15,
    color: TOKENS.inkSoft,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 4,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 14,
    gap: 8,
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
  goalRowRight: {
    flex: 1,
    gap: 8,
  },
  goalRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalRowBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: TOKENS.creamDark,
    flexDirection: 'row-reverse',
  },
  goalRowFill: {
    height: 6,
    borderRadius: 3,
  },
  goalRowPct: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 13,
    minWidth: 36,
    textAlign: 'right',
  },
  goalRowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'flex-end',
  },
  goalRowEmoji: {
    fontSize: 20,
  },
  goalRowLabel: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 14,
    color: TOKENS.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
    flex: 1,
  },
  goalRowAmount: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 12,
    color: TOKENS.inkMute,
    textAlign: 'right',
  },
  addGoalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: TOKENS.lavenderDeep,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 14,
  },
  addGoalText: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 15,
    color: TOKENS.blue,
    writingDirection: 'rtl',
  },
});
