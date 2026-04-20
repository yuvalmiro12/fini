import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  OBWelcome,
  OBGoal,
  OBIncome,
  OBPlan,
} from '@/components/screens/OnboardingScreens';
import { TOKENS } from '@/lib/tokens';

const TOTAL_STEPS = 4;

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      // Onboarding complete — go to tabs
      router.replace('/(tabs)');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const props = {
    onNext: handleNext,
    onBack: handleBack,
    step,
    totalSteps: TOTAL_STEPS,
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {step === 0 && <OBWelcome {...props} />}
      {step === 1 && <OBGoal {...props} />}
      {step === 2 && <OBIncome {...props} />}
      {step === 3 && <OBPlan {...props} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TOKENS.rose,
  },
});
