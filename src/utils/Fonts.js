// @flow
import { FONT_STYLES } from '../constants';
import extend from 'lodash/extend';

import type { Style } from '../types/react';
import type {
  FontStyle,
  FontRole,
  FontContentStyle,
  FontSize,
} from '../types/fonts';

type FontParams = { contentStyle?: FontContentStyle, size?: FontSize };

export function getFontStyle(role: FontRole, params?: FontParams): Style {
  const fontStyle = FONT_STYLES[role];
  return {
    ...fontStyle.style,
    ...getModifiers(fontStyle, params),
  };
}

function getModifiers(fontStyle: FontStyle, params?: FontParams): Style {
  const modifiers = fontStyle.modifiers;
  if (!modifiers || !params) {
    return {};
  }
  if (!params) {
    return {};
  }
  const contentStyleModifiers = modifiers
    .filter(m => m.name === params?.contentStyle)
    .map(m => m.style);
  const fontSizeModifiers = modifiers
    .filter(m => m.name === params?.size)
    .map(m => m.style);
  return {
    ...extend({}, ...contentStyleModifiers),
    ...extend({}, ...fontSizeModifiers),
  };
}
