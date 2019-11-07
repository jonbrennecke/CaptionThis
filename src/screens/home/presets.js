// @flow
import {
  UI_COLORS,
  USER_TEXT_COLOR_CHOICES,
  FONT_FAMILIES,
  USER_BACKGROUND_COLOR_CHOICES,
} from '../../constants';
import * as Color from '../../utils/Color';

import type { CaptionStyleObject } from '../../types/video';

export const presetDefaultFontSize = 20;

export const PRESET_STYLES: CaptionStyleObject[] = [
  {
    textAlignment: 'center',
    lineStyle: 'fadeInOut',
    wordStyle: 'none',
    backgroundStyle: 'textBoundingBox',
    backgroundColor: Color.hexToRgbaObject(UI_COLORS.WHITE),
    fontFamily: FONT_FAMILIES.RIGHTEOUS,
    textColor: Color.hexToRgbaObject(UI_COLORS.BLACK),
    fontSize: presetDefaultFontSize,
  },
  {
    textAlignment: 'left',
    lineStyle: 'translateUp',
    wordStyle: 'none',
    backgroundStyle: 'gradient',
    backgroundColor: Color.hexToRgbaObject(UI_COLORS.BLACK),
    fontFamily: FONT_FAMILIES.RIGHTEOUS,
    textColor: Color.hexToRgbaObject(USER_TEXT_COLOR_CHOICES[0]),
    fontSize: presetDefaultFontSize,
  },
  {
    textAlignment: 'center',
    lineStyle: 'translateUp',
    wordStyle: 'animated',
    backgroundStyle: 'gradient',
    backgroundColor: Color.hexToRgbaObject(UI_COLORS.MEDIUM_RED),
    fontFamily: FONT_FAMILIES.BANGERS,
    textColor: Color.hexToRgbaObject(USER_TEXT_COLOR_CHOICES[0]),
    fontSize: presetDefaultFontSize,
  },
  {
    textAlignment: 'left',
    lineStyle: 'translateUp',
    wordStyle: 'none',
    backgroundStyle: 'solid',
    backgroundColor: Color.hexToRgbaObject(UI_COLORS.WHITE),
    fontFamily: FONT_FAMILIES.STAATLICHES,
    textColor: Color.hexToRgbaObject(USER_TEXT_COLOR_CHOICES[1]),
    fontSize: presetDefaultFontSize,
  },
  {
    textAlignment: 'center',
    lineStyle: 'translateUp',
    wordStyle: 'none',
    backgroundStyle: 'gradient',
    backgroundColor: Color.hexToRgbaObject(UI_COLORS.DARK_GREY),
    fontFamily: FONT_FAMILIES.ROBOTO,
    textColor: Color.hexToRgbaObject(USER_TEXT_COLOR_CHOICES[2]),
    fontSize: presetDefaultFontSize,
  },
  {
    textAlignment: 'left',
    lineStyle: 'translateUp',
    wordStyle: 'animated',
    backgroundStyle: 'gradient',
    backgroundColor: Color.hexToRgbaObject(USER_BACKGROUND_COLOR_CHOICES[11]),
    fontFamily: FONT_FAMILIES.AMATIC,
    textColor: Color.hexToRgbaObject(USER_TEXT_COLOR_CHOICES[0]),
    fontSize: presetDefaultFontSize,
  },
  {
    textAlignment: 'left',
    lineStyle: 'translateUp',
    wordStyle: 'none',
    backgroundStyle: 'solid',
    backgroundColor: Color.hexToRgbaObject(USER_BACKGROUND_COLOR_CHOICES[10]),
    fontFamily: FONT_FAMILIES.CRETE_ROUND,
    textColor: Color.hexToRgbaObject(USER_TEXT_COLOR_CHOICES[0]),
    fontSize: presetDefaultFontSize,
  },
];
