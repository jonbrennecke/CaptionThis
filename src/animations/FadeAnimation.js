// @flow
import { Animated, Easing } from 'react-native';

import type { Style } from '../types/react';
import type { Animation } from './types';

export default class FadeAnimation implements Animation {
  value: Animated.Value;

  constructor({ start }: { start: 'in' | 'out' }) {
    this.value = new Animated.Value(start === 'in' ? 1 : 0);
  }

  animateIn() {
    Animated.timing(this.value, {
      toValue: 1,
      duration: 1000,
      easing: Easing.quad,
    }).start();
  }

  animateOut() {
    Animated.timing(this.value, {
      toValue: 0,
      duration: 300,
      easing: Easing.quad,
    }).start();
  }

  getAnimatedStyle(): Style {
    return {
      opacity: this.value,
    };
  }
}
