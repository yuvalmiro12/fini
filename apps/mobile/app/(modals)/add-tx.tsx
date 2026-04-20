import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import CatIcon from '@/components/ui/CatIcon';
import { TOKENS } from '@/lib/tokens';
import { CATS } from '@/lib/cats';

export default function AddTxModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [note, setNote] = useState('');
  const [selectedCat, setSelectedCat] = useState('food');

  const catList = Object.values(CATS).filter(
    (c) => c.type === 'both' || c.type === type
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Icon name="close" size={20} color={TOKENS.inkSoft} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>הוספת עסקה</Text>
        <View style={styles.closeBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Type toggle */}
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[
              styles.typeBtn,
              type === 'income' && styles.typeBtnActiveIncome,
            ]}
            onPress={() => setType('income')}
          >
            <Text
              style={[
                styles.typeBtnText,
                type === 'income' && styles.typeBtnTextActive,
              ]}
            >
              הכנסה
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeBtn,
              type === 'expense' && styles.typeBtnActiveExpense,
            ]}
            onPress={() => setType('expense')}
          >
            <Text
              style={[
                styles.typeBtnText,
                type === 'expense' && styles.typeBtnTextActive,
              ]}
            >
              הוצאה
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <View style={styles.amountWrap}>
          <Text style={styles.currencySign}>₪</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            placeholderTextColor="rgba(255,255,255,0.5)"
            keyboardType="numeric"
            textAlign="center"
          />
        </View>

        {/* Merchant */}
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>עסק / תיאור</Text>
          <TextInput
            style={styles.fieldInput}
            value={merchant}
            onChangeText={setMerchant}
            placeholder="שם העסק"
            placeholderTextColor={TOKENS.inkMute}
            textAlign="right"
            writingDirection="rtl"
          />
        </View>

        {/* Categories */}
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>קטגוריה</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catScroll}
          >
            {catList.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.catChip,
                  { backgroundColor: cat.tint },
                  selectedCat === cat.id && styles.catChipSelected,
                ]}
                onPress={() => setSelectedCat(cat.id)}
                activeOpacity={0.75}
              >
                <CatIcon catId={cat.id} size={28} iconSize={14} />
                <Text
                  style={[
                    styles.catChipText,
                    { color: cat.color },
                    selectedCat === cat.id && styles.catChipTextSelected,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Note */}
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>הערה (אופציונלי)</Text>
          <TextInput
            style={[styles.fieldInput, styles.noteInput]}
            value={note}
            onChangeText={setNote}
            placeholder="הוסף הערה..."
            placeholderTextColor={TOKENS.inkMute}
            textAlign="right"
            writingDirection="rtl"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={[
            styles.saveBtn,
            { backgroundColor: type === 'expense' ? TOKENS.expense : TOKENS.income },
          ]}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>שמור עסקה</Text>
        </TouchableOpacity>
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
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(200,90,138,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: TOKENS.fontBold,
    fontSize: 18,
    color: TOKENS.ink,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  content: {
    padding: 20,
    gap: 20,
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(200,90,138,0.1)',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  typeBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBtnActiveExpense: {
    backgroundColor: TOKENS.expense,
    ...Platform.select({
      ios: {
        shadowColor: TOKENS.expense,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
    }),
  },
  typeBtnActiveIncome: {
    backgroundColor: TOKENS.income,
    ...Platform.select({
      ios: {
        shadowColor: TOKENS.income,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
    }),
  },
  typeBtnText: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 15,
    color: TOKENS.inkSoft,
    writingDirection: 'rtl',
  },
  typeBtnTextActive: {
    color: 'white',
  },
  amountWrap: {
    backgroundColor: TOKENS.pink,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    ...Platform.select({
      ios: {
        shadowColor: TOKENS.pink,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
    }),
  },
  currencySign: {
    fontFamily: TOKENS.fontBold,
    fontSize: 36,
    color: 'white',
  },
  amountInput: {
    fontFamily: TOKENS.fontBold,
    fontSize: 52,
    color: 'white',
    minWidth: 120,
  },
  fieldWrap: {
    gap: 8,
  },
  fieldLabel: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 14,
    color: TOKENS.inkSoft,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  fieldInput: {
    backgroundColor: 'white',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: TOKENS.fontRegular,
    fontSize: 15,
    color: TOKENS.ink,
    borderWidth: 1,
    borderColor: 'rgba(200,90,138,0.15)',
  },
  noteInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  catScroll: {
    gap: 8,
    flexDirection: 'row',
    paddingVertical: 4,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  catChipSelected: {
    borderColor: TOKENS.pink,
  },
  catChipText: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 12,
    writingDirection: 'rtl',
  },
  catChipTextSelected: {
    fontFamily: TOKENS.fontSemiBold,
  },
  saveBtn: {
    borderRadius: 28,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
  saveBtnText: {
    fontFamily: TOKENS.fontBold,
    fontSize: 17,
    color: 'white',
    writingDirection: 'rtl',
  },
});
