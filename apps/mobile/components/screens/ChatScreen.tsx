import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  I18nManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FiniAvatar } from '@/components/ui/FiniMascot';
import Icon from '@/components/ui/Icon';
import CatIcon from '@/components/ui/CatIcon';
import { TOKENS } from '@/lib/tokens';
import { SEED_CHAT_MESSAGES } from '@/lib/seed';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  date: string;
}

function DateDivider({ label }: { label: string }) {
  return (
    <View style={styles.dateDividerRow}>
      <View style={styles.dateLine} />
      <Text style={styles.dateDividerText}>{label}</Text>
      <View style={styles.dateLine} />
    </View>
  );
}

function FBubble({ text }: { text: string }) {
  return (
    <View style={styles.fBubbleRow}>
      <View style={styles.fBubbleAvatarWrap}>
        <FiniAvatar size={32} />
      </View>
      <View style={styles.fBubble}>
        <Text style={styles.fBubbleText}>{text}</Text>
      </View>
    </View>
  );
}

function UBubble({ text }: { text: string }) {
  return (
    <View style={styles.uBubbleRow}>
      <View style={styles.uBubble}>
        <Text style={styles.uBubbleText}>{text}</Text>
      </View>
    </View>
  );
}

function TxChip({ merchant, amount, category }: { merchant: string; amount: number; category: string }) {
  return (
    <TouchableOpacity style={styles.txChip} activeOpacity={0.7}>
      <CatIcon catId={category} size={32} />
      <View style={styles.txChipInfo}>
        <Text style={styles.txChipMerchant}>{merchant}</Text>
        <Text style={styles.txChipAmount}>₪{amount.toLocaleString()}</Text>
      </View>
      <Icon name="chevronLeft" size={16} color={TOKENS.inkMute} />
    </TouchableOpacity>
  );
}

function InsightCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.insightCard}>
      <Text style={styles.insightCardTitle}>{title}</Text>
      <Text style={styles.insightCardSubtitle}>{subtitle}</Text>
    </View>
  );
}

function SuggChips({ chips, onPress }: { chips: string[]; onPress: (c: string) => void }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.suggChipsContainer}
      style={styles.suggChipsScroll}
    >
      {chips.map((chip) => (
        <TouchableOpacity
          key={chip}
          style={styles.suggChip}
          onPress={() => onPress(chip)}
          activeOpacity={0.7}
        >
          <Text style={styles.suggChipText}>{chip}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const SUGG_CHIPS = [
  'כמה חסכתי?',
  'נתח הוצאות',
  'הוסף עסקה',
  'יעדי חיסכון',
  'תקציב החודש',
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>(SEED_CHAT_MESSAGES);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = () => {
    const text = input.trim();
    if (\!text) return;
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      text,
      date: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleSugg = (chip: string) => {
    setInput(chip);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.headerBtn}>
            <Icon name="calendar" size={20} color={TOKENS.inkSoft} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Icon name="dots" size={20} color={TOKENS.inkSoft} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>פיני</Text>
          <Text style={styles.headerSubtitle}>עוזר פיננסי אישי · מחובר</Text>
        </View>
        <View style={styles.headerRight}>
          <FiniAvatar size={40} hasPresence />
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={[styles.messagesContent, { paddingBottom: 12 }]}
        showsVerticalScrollIndicator={false}
      >
        <DateDivider label="היום" />

        {messages.map((msg) =>
          msg.role === 'assistant' ? (
            <FBubble key={msg.id} text={msg.text} />
          ) : (
            <UBubble key={msg.id} text={msg.text} />
          )
        )}

        {/* Example TxChip */}
        <FBubble text="הנה ההוצאה האחרונה שלך:" />
        <View style={styles.chipWrap}>
          <TxChip merchant="רמי לוי" amount={245} category="food" />
        </View>

        {/* Example InsightCard */}
        <InsightCard
          title="הוצאות אוכל גבוהות ב-32%"
          subtitle="הוצאת ₪491 על אוכל החודש, לעומת ₪372 בממוצע"
        />

        {/* Suggestions */}
        <SuggChips chips={SUGG_CHIPS} onPress={handleSugg} />
      </ScrollView>

      {/* Composer */}
      <View
        style={[
          styles.composer,
          { paddingBottom: Math.max(insets.bottom + 72, 84) },
        ]}
      >
        <TouchableOpacity style={styles.composerBtn}>
          <Icon name="camera" size={20} color={TOKENS.inkSoft} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.composerBtn}>
          <Icon name="plus" size={20} color={TOKENS.inkSoft} />
        </TouchableOpacity>
        <TextInput
          style={styles.composerInput}
          value={input}
          onChangeText={setInput}
          placeholder="שאל אותי משהו..."
          placeholderTextColor={TOKENS.inkMute}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          textAlign="right"
          writingDirection="rtl"
          multiline={false}
        />
        <TouchableOpacity
          style={[styles.micBtn, input.trim() && styles.sendBtn]}
          onPress={input.trim() ? handleSend : undefined}
          activeOpacity={0.8}
        >
          <Icon
            name={input.trim() ? 'send' : 'mic'}
            size={18}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(253,221,232,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200,90,138,0.12)',
  },
  headerLeft: {
    flexDirection: 'row',
    gap: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {},
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(200,90,138,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: TOKENS.fontBold,
    fontSize: 17,
    color: TOKENS.ink,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  headerSubtitle: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 12,
    color: TOKENS.inkMute,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  dateDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 8,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(200,90,138,0.15)',
  },
  dateDividerText: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 12,
    color: TOKENS.inkMute,
    textAlign: 'center',
  },
  fBubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
  fBubbleAvatarWrap: {
    marginBottom: 2,
  },
  fBubble: {
    backgroundColor: 'white',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: TOKENS.pink,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  fBubbleText: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 15,
    color: TOKENS.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 22,
  },
  uBubbleRow: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  uBubble: {
    backgroundColor: TOKENS.pink,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  uBubbleText: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 15,
    color: 'white',
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 22,
  },
  txChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 10,
    gap: 10,
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
  txChipInfo: {
    flex: 1,
  },
  txChipMerchant: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 14,
    color: TOKENS.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  txChipAmount: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 15,
    color: TOKENS.expense,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  insightCard: {
    backgroundColor: TOKENS.goldTint,
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: TOKENS.gold,
    marginTop: 4,
  },
  insightCardTitle: {
    fontFamily: TOKENS.fontSemiBold,
    fontSize: 14,
    color: TOKENS.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 4,
  },
  insightCardSubtitle: {
    fontFamily: TOKENS.fontRegular,
    fontSize: 13,
    color: TOKENS.inkSoft,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  chipWrap: {
    paddingHorizontal: 0,
  },
  suggChipsScroll: {
    marginTop: 4,
  },
  suggChipsContainer: {
    gap: 8,
    paddingVertical: 4,
    flexDirection: 'row',
  },
  suggChip: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(200,90,138,0.2)',
  },
  suggChipText: {
    fontFamily: TOKENS.fontMedium,
    fontSize: 13,
    color: TOKENS.pink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: 'rgba(253,221,232,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(200,90,138,0.12)',
    gap: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  composerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(200,90,138,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 14,
    fontFamily: TOKENS.fontRegular,
    fontSize: 15,
    color: TOKENS.ink,
    borderWidth: 1,
    borderColor: 'rgba(200,90,138,0.2)',
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: TOKENS.pink,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: TOKENS.pink,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: { elevation: 4 },
    }),
  },
  sendBtn: {
    backgroundColor: TOKENS.pink,
  },
});
