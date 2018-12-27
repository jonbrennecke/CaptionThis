// @flow
import React from 'react';
import { TextInput } from 'react-native';

import * as Fonts from '../../../utils/Fonts';

import type { Style } from '../../../types/react';

type Props = {
  value: ?string,
  onShouldChangeValue: (text: string) => void,
  style?: ?Style,
}; // TODO: union with TextInput props

const styles = {
  textInput: {
    flex: 1,
    ...Fonts.getFontStyle('formInput'),
  },
};

export default function FormTextInput({
  style,
  value,
  onShouldChangeValue,
  ...etc
}: Props) {
  return (
    <TextInput
      style={[styles.textInput, style]}
      value={value}
      onChangeText={onShouldChangeValue}
      {...etc}
    />
  );
}
