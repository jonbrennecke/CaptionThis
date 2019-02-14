// @flow
import type { Orientation } from '../types/media';

export function isPortrait(orientation: Orientation): boolean {
  return !isLandscape(orientation);
}

export function isLandscape(orientation: Orientation): boolean {
  switch (orientation) {
    case 'left':
    case 'leftMirrored':
    case 'right':
    case 'rightMirrored':
      return true;
    default:
      return false;
  }
}
