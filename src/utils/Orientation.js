// @flow
import type { ImageOrientation } from '../types/media';

export function isPortrait(orientation: ImageOrientation): boolean {
  return !isLandscape(orientation);
}

export function isLandscape(orientation: ImageOrientation): boolean {
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
