// @flow
import type { Style } from '../types/react';

export interface Animation {
  constructor({ start: 'in' | 'out', delay?: number }): void;
  animateIn(completionHandler?: () => void): void;
  animateOut(completionHandler?: () => void): void;
  getAnimatedStyle(): ?Style;
}
