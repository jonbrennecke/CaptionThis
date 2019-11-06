// @flow
import type { ColorRGBA } from './media';

export type CaptionLineStyle = 'fadeInOut' | 'translateUp';
export type CaptionTextAlignment = 'center' | 'left' | 'right';
export type CaptionWordStyle = 'animated' | 'none';
export type CaptionBackgroundStyle = 'none' | 'gradient' | 'solid' | 'textBoundingBox';

export type CaptionStyleObject = {|
  textAlignment: CaptionTextAlignment,
  lineStyle: CaptionLineStyle,
  wordStyle: CaptionWordStyle,
  backgroundStyle: CaptionBackgroundStyle,
  backgroundColor: ColorRGBA,
  textColor: ColorRGBA,
  fontSize: number,
  fontFamily: string,
|};

export type CaptionTextSegment = {
  duration: number,
  timestamp: number,
  text: string,
};
