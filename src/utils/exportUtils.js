// @flow
import { isLandscape } from './Orientation';

import type {
  Size,
  Orientation,
} from '../types/media';

export const captionViewHeight = 85;
export const captionViewOffsetFromBottom = 75;

export const exportFontSize = (
  fontSize: number,
  viewSize: Size,
  dimensions: Size,
  orientation: Orientation
): number => {
  const aspectRatio = isLandscape(orientation)
    ? dimensions.width / viewSize.height
    : dimensions.height / viewSize.height;
  return fontSize * aspectRatio;
};

export const normalizeVideoDimensions = (
  dimensions: Size,
  orientation: Orientation
): Size => {
  const { height, width } = dimensions;
  return isLandscape(orientation)
    ? height > width ? { height: width, width: height } : { height, width }
    : height > width ? { height, width } : { height: width, width: height }
}

export const exportBackgroundHeight = (
  dimensions: Size,
  viewSize: Size
): number => {
  const heightRatio = dimensions.height / viewSize.height;
  return (captionViewHeight + captionViewOffsetFromBottom) * heightRatio;
};
