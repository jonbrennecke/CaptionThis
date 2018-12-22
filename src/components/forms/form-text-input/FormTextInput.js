// @flow
import React from 'react';
import { TextInput } from 'react-native';

import { TEXT_COLORS, FONTS, FONT_SIZES } from '../../../constants';

import type { Style } from '../../../types/react';

type Props = {
  value: ?string,
  onShouldChangeValue: (text: string) => void,
  style?: ?Style,
};

const styles = {
  textInput: {
    flex: 1,
    color: TEXT_COLORS.DARK_GREY,
    fontFamily: FONTS.PASSION_ONE,
    fontSize: FONT_SIZES.INPUT,
  },
};

export default function FormTextInput({ style, value, onShouldChangeValue }: Props) {
  return (
    <TextInput
      style={[styles.textInput, style]}
      value={value}
      onChangeText={onShouldChangeValue}
    />
  );
}
