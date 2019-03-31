// @flow
import type { ColorRGBA } from './media';

export type LineStyle = 'oneLine' | 'twoLines';

export type CaptionPresetStyleObject = {
  textAlignment: 'center' | 'left' | 'right',
  lineStyle: 'fadeInOut' | 'translateY',
  wordStyle: 'animated' | 'none',
  backgroundStyle: 'gradient' | 'solid',
  backgroundColor: ColorRGBA,
};

export type CaptionStyleObject = {
  textAlignment: 'center' | 'left' | 'right',
  lineStyle: 'fadeInOut' | 'translateY',
  wordStyle: 'animated' | 'none',
  backgroundStyle: 'gradient' | 'solid',
  backgroundColor: ColorRGBA,
  fontSize: number,
  fontFamily: string,
};
