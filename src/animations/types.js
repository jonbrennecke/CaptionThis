// @flow
import type { Style } from '../types/react';

export interface Animation {
  constructor({ start: 'in' | 'out', delay?: number }): void;
  animateIn(): void;
  animateOut(): void;
  getAnimatedStyle(): ?Style;
}
