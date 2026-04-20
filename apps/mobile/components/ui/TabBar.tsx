import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from './Icon';
import { TOKENS } from '@/lib/tokens';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'data', label: 'נתונים', icon: 'data' },
  { id: 'insights', label: 'תובנות', icon: 'insights' },
  { id: 'chat', label: 'צ׳אט', icon: 'chat' },
];

interface TabBarProps {
  activeTab: string;
  onTabPress: (id: string) => void;
}

export default function TabBar({ activeTab, onTabPress }: TabBarProps) {
  const insets = useSafeAreaInsets();

  const getAccentColor = (tabId: string) => {
    switch (tabId) {
      case 'chat':
        return TOKENS.pink;
      case 'insights':
        return TOKENS.green;
      case 'data':
        return TOKENS.blue;
      default:
        return TOKENS.pink;
    }
  };

  const getActiveBg = (tabId: string) => {
    switch (tabId) {
      case 'chat':
        return TOKENS.rose;
      case 'insights':
        return TOKENS.mint;
      case 'data':
        return TOKENS.lavender;
      default:
        return TOKENS.rose;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      <View style={styles.inner}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const accent = getAccentColor(tab.id);
          const activeBg = getActiveBg(tab.id);

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.pill,
                  isActive && {
                    backgroundColor: activeBg,
                    shadowColor: accent,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 6,
                    elevation: 3,
                  },
                ]}
              >
                <Icon
                  name={tab.icon}
                  size={22}
                  color={isActive ? accent : TOKENS.inkMute}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  {
                    color: isActive ? accent : TOKENS.inkMute,
                    fontFamily: isActive ? TOKENS.fontSemiBold : TOKENS.fontRegular,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(247,245,232,0.96)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(31,26,21,0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#1F1A15',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  inner: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  pill: {
    width: 48,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});
