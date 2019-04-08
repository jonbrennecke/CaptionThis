// @flow
import type { AppState } from '../../types/redux';
import type { ColorRGBA } from '../../types/media';
import type {
  CaptionLineStyle,
  CaptionBackgroundStyle,
  CaptionStyleObject,
} from '../../types/video';

export function getFontFamily(state: AppState): string {
  return getCaptionStyle(state).fontFamily;
}

export function getBackgroundColor(state: AppState): ColorRGBA {
  return getCaptionStyle(state).backgroundColor;
}

export function getTextColor(state: AppState): ColorRGBA {
  return getCaptionStyle(state).textColor;
}

export function getFontSize(state: AppState): number {
  return getCaptionStyle(state).fontSize;
}

export function getLineStyle(state: AppState): CaptionLineStyle {
  return getCaptionStyle(state).lineStyle;
}

export function getBackgroundStyle(state: AppState): CaptionBackgroundStyle {
  return getCaptionStyle(state).backgroundStyle;
}

export function getCaptionStyle(state: AppState): CaptionStyleObject {
  return state.video.captionStyle;
}
