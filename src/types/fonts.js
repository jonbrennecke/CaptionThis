// @flow
import type { Style } from './react';

export type FontRole =
  | 'button'
  | 'heading'
  | 'callToAction'
  | 'title'
  | 'formInput'
  | 'formLabel'
  | 'default';

export type FontContentStyle = 'lightContent' | 'darkContent';

export type FontSize = 'small' | 'medium' | 'large';

export type FontStyleModifier = {
  name: FontContentStyle | FontSize,
  style: Style,
};

export type FontStyle = {
  style: Style,
  modifiers?: FontStyleModifier[],
};
