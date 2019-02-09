// @flow
import { Animated, Easing } from 'react-native';

import type { Style } from '../types/react';
import type { Animation } from './types';

export default class BottomSheetAnimation implements Animation {
  value = new Animated.Value(0);
  delay: number;

  constructor({ start, delay = 0 }: { start: 'in' | 'out', delay?: number }) {
    this.value = new Animated.Value(start === 'in' ? 1 : 0);
    this.delay = delay;
  }

  animateIn(completionHandler?: () => void) {
    Animated.timing(this.value, {
      toValue: 1,
      duration: 150,
      delay: this.delay,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(completionHandler);
  }

  animateOut(completionHandler?: () => void) {
    Animated.timing(this.value, {
      toValue: 0,
      duration: 150,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(completionHandler);
  }

  getAnimatedStyle(): Style {
    return {
      opacity: this.value,
      transform: [
        {
          translateY: this.value.interpolate({
            inputRange: [0, 1],
            outputRange: [300, 0],
          }),
        },
      ],
    };
  }
}
