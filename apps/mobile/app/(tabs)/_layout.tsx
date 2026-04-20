import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import TabBar from '@/components/ui/TabBar';
import ChatScreen from '@/components/screens/ChatScreen';
import InsightsScreen from '@/components/screens/InsightsScreen';
import DataScreen from '@/components/screens/DataScreen';
import { TOKENS } from '@/lib/tokens';

export default function TabsLayout() {
  const [activeTab, setActiveTab] = useState<'chat' | 'insights' | 'data'>('chat');

  const renderScreen = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatScreen />;
      case 'insights':
        return <InsightsScreen />;
      case 'data':
        return <DataScreen />;
      default:
        return <ChatScreen />;
    }
  };

  return (
    <View style={styles.root}>
      {/* Screen content */}
      <View style={styles.content}>{renderScreen()}</View>

      {/* Custom Tab Bar */}
      <TabBar
        activeTab={activeTab}
        onTabPress={(id) => setActiveTab(id as typeof activeTab)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TOKENS.cream,
  },
  content: {
    flex: 1,
  },
});
