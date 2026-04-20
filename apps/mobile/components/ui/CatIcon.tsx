import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from './Icon';
import { CATS } from '@/lib/cats';

interface CatIconProps {
  catId: string;
  size?: number;
  iconSize?: number;
}

export default function CatIcon({ catId, size = 40, iconSize }: CatIconProps) {
  const cat = CATS[catId] ?? CATS['other'];
  const resolvedIconSize = iconSize ?? Math.round(size * 0.5);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size * 0.3,
          backgroundColor: cat.tint,
        },
      ]}
    >
      <Icon name={cat.icon} size={resolvedIconSize} color={cat.color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
