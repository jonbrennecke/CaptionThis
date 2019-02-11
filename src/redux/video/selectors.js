// @flow
import type { AppState } from '../../types/redux';
import type { ColorRGBA } from '../../types/media';
import type { LineStyle } from '../../types/video';

export function getFontFamily(state: AppState): string {
  return state.video.fontFamily;
}

export function getBackgroundColor(state: AppState): ColorRGBA {
  return state.video.backgroundColor;
}

export function getTextColor(state: AppState): ColorRGBA {
  return state.video.textColor;
}

export function getFontSize(state: AppState): number {
  return state.video.fontSize;
}

export function getLineStyle(state: AppState): LineStyle {
  return state.video.lineStyle;
}
