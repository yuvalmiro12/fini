import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Circle,
  Path,
  Ellipse,
  G,
} from 'react-native-svg';
import { TOKENS } from '@/lib/tokens';

interface FiniMascotProps {
  size?: number;
  wave?: boolean;
}

export default function FiniMascot({ size = 120, wave = false }: FiniMascotProps) {
  const scale = size / 120;

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Defs>
        <RadialGradient id="coinGrad" cx="40%" cy="35%" r="65%">
          <Stop offset="0%" stopColor="#FFE57A" />
          <Stop offset="50%" stopColor="#F5C842" />
          <Stop offset="100%" stopColor="#C9A24D" />
        </RadialGradient>
        <RadialGradient id="faceGrad" cx="50%" cy="40%" r="60%">
          <Stop offset="0%" stopColor="#FFF8E1" />
          <Stop offset="100%" stopColor="#FFE082" />
        </RadialGradient>
        <RadialGradient id="cheekGrad" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFCDD2" stopOpacity="0.8" />
          <Stop offset="100%" stopColor="#EF9A9A" stopOpacity="0.4" />
        </RadialGradient>
      </Defs>

      {/* Coin body */}
      <Circle cx="60" cy="65" r="48" fill="url(#coinGrad)" />
      <Circle cx="60" cy="65" r="43" fill="url(#faceGrad)" />

      {/* Coin rim detail */}
      <Circle
        cx="60"
        cy="65"
        r="48"
        fill="none"
        stroke="#C9A24D"
        strokeWidth="2"
        strokeDasharray="4 3"
      />

      {/* Antenna */}
      <Path
        d="M60 17 Q65 10 72 8"
        stroke="#C9A24D"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx="72" cy="8" r="4" fill="#F5C842" stroke="#C9A24D" strokeWidth="1.5" />
      <Circle cx="72" cy="8" r="2" fill="#C9A24D" />

      {/* Eyes */}
      <Ellipse cx="47" cy="60" rx="5.5" ry="6" fill="#1F1A15" />
      <Ellipse cx="73" cy="60" rx="5.5" ry="6" fill="#1F1A15" />
      {/* Eye shine */}
      <Circle cx="49" cy="57.5" r="1.8" fill="white" />
      <Circle cx="75" cy="57.5" r="1.8" fill="white" />

      {/* Cheeks */}
      <Ellipse cx="40" cy="70" rx="8" ry="5" fill="url(#cheekGrad)" />
      <Ellipse cx="80" cy="70" rx="8" ry="5" fill="url(#cheekGrad)" />

      {/* Smile */}
      <Path
        d="M50 76 Q60 84 70 76"
        stroke="#C9A24D"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Wave hand (optional) */}
      {wave && (
        <G>
          <Path
            d="M108 50 Q115 43 112 36 Q109 29 103 33 Q101 28 96 31 Q93 26 88 29 Q83 25 80 30 L78 55 Q88 68 100 62 Z"
            fill="#F5C842"
            stroke="#C9A24D"
            strokeWidth="1.5"
          />
          <Path d="M103 33 L100 50" stroke="#C9A24D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <Path d="M96 31 L93 50" stroke="#C9A24D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <Path d="M88 29 L87 48" stroke="#C9A24D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </G>
      )}

      {/* Sparkle top-left */}
      <Path
        d="M22 28 L23.5 23 L25 28 L30 29.5 L25 31 L23.5 36 L22 31 L17 29.5 Z"
        fill="#FFE57A"
        opacity="0.8"
      />
    </Svg>
  );
}

interface FiniAvatarProps {
  size?: number;
  hasPresence?: boolean;
}

export function FiniAvatar({ size = 44, hasPresence = false }: FiniAvatarProps) {
  return (
    <View style={[styles.avatarWrap, { width: size, height: size, borderRadius: size / 2 }]}>
      <Svg width={size * 0.85} height={size * 0.85} viewBox="0 0 38 38">
        <Defs>
          <RadialGradient id="avGrad" cx="40%" cy="35%" r="65%">
            <Stop offset="0%" stopColor="#FFE57A" />
            <Stop offset="100%" stopColor="#C9A24D" />
          </RadialGradient>
        </Defs>
        {/* Face */}
        <Circle cx="19" cy="21" r="16" fill="url(#avGrad)" />
        <Circle cx="19" cy="21" r="13" fill="#FFF8E1" />
        {/* Eyes */}
        <Ellipse cx="14" cy="20" rx="2" ry="2.2" fill="#1F1A15" />
        <Ellipse cx="24" cy="20" rx="2" ry="2.2" fill="#1F1A15" />
        <Circle cx="14.8" cy="19" r="0.7" fill="white" />
        <Circle cx="24.8" cy="19" r="0.7" fill="white" />
        {/* Smile */}
        <Path d="M15 25 Q19 29 23 25" stroke="#C9A24D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Cheeks */}
        <Ellipse cx="11" cy="23" rx="3" ry="2" fill="#FFCDD2" opacity="0.6" />
        <Ellipse cx="27" cy="23" rx="3" ry="2" fill="#FFCDD2" opacity="0.6" />
        {/* Sparkle */}
        <Path d="M5 8 L5.8 5 L6.6 8 L9.5 8.8 L6.6 9.6 L5.8 12.5 L5 9.6 L2 8.8 Z" fill="#FFE57A" />
      </Svg>

      {hasPresence && (
        <View
          style={[
            styles.presenceDot,
            {
              width: size * 0.28,
              height: size * 0.28,
              borderRadius: size * 0.14,
              bottom: 0,
              right: 0,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarWrap: {
    backgroundColor: TOKENS.rose,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  presenceDot: {
    position: 'absolute',
    backgroundColor: TOKENS.green,
    borderWidth: 2,
    borderColor: 'white',
  },
});
