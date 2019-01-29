// @flow
import type { Style } from '../types/react';

export interface Animation {
  constructor({ start: 'in' | 'out' }): void;
  animateIn(): void;
  animateOut(): void;
  getAnimatedStyle(): ?Style;
}
