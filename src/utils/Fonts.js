// @flow
import { FONT_STYLES } from '../constants';

import type { Style } from '../types/react';

type FontRole =
  | 'button'
  | 'heading'
  | 'call-to-action'
  | 'title'
  | 'form-input'
  | 'form-label'
  | 'default';
type FontContentStyle = 'light-content' | 'dark-content';
type FontSize = 'small' | 'medium' | 'large';
type FontParams = { contentStyle?: FontContentStyle, size?: FontSize };

export function getFontStyle(role: FontRole, params?: FontParams): Style {
  switch (role) {
    case 'form-input':
      return FONT_STYLES.FORM_INPUT_DEFAULT_STYLES;
    case 'form-label':
      return FONT_STYLES.FORM_LABEL_DEFAULT_STYLES;
    case 'button':
      return {
        ...FONT_STYLES.BUTTON_DEFAULT_STYLES,
        ...(params && params.size ? getFontSize(role, params.size) : {}),
      };
    case 'heading':
      return {
        ...FONT_STYLES.HEADING_DEFAULT_STYLES,
        ...(params && params.contentStyle
          ? getFontContentStyle(role, params.contentStyle)
          : {}),
        ...(params && params.size ? getFontSize(role, params.size) : {}),
      };
    case 'call-to-action':
      return FONT_STYLES.CALL_TO_ACTION_FONT_STYLES;
    case 'title':
      return FONT_STYLES.TITLE_FONT_STYLES;
    default:
      return FONT_STYLES.DEFAULT_FONT_STYLES;
  }
}

function getFontContentStyle(role, contentStyle: FontContentStyle): Style {
  switch (role) {
    case 'heading':
      return contentStyle === 'light-content'
        ? FONT_STYLES.HEADING_LIGHT_CONTENT_STYLES
        : {};
    default:
      return {};
  }
}

function getFontSize(role, size: FontSize): Style {
  switch (role) {
    case 'heading':
      switch (size) {
        case 'small':
          return FONT_STYLES.HEADING_SMALL_FONT_SIZE_STYLES;
        case 'large':
          return FONT_STYLES.HEADING_LARGE_FONT_SIZE_STYLES;
        default:
          return {};
      }
    case 'button':
      switch (size) {
        case 'small':
          return FONT_STYLES.BUTTON_SMALL_FONT_SIZE_STYLES;
        default:
          return {};
      }
    default:
      return {};
  }
}
