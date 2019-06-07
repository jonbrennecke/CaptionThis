// @flow
import type { ColorRGBA, Size, Point } from './media';

export type CaptionLineStyle = 'fadeInOut' | 'translateY';
export type CaptionTextAlignment = 'center' | 'left' | 'right';
export type CaptionWordStyle = 'animated' | 'none';
export type CaptionBackgroundStyle = 'gradient' | 'solid';

export type CaptionPresetStyleObject = {|
  textAlignment: CaptionTextAlignment,
  lineStyle: CaptionLineStyle,
  wordStyle: CaptionWordStyle,
  backgroundStyle: CaptionBackgroundStyle,
  backgroundColor: ColorRGBA,
  fontFamily: string,
  textColor: ColorRGBA,
|};

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

export type CaptionViewLayout = {
  size: Size,
  origin: Point,
};
