// @flow
import React from 'react';
import { View, Text } from 'react-native';

import { UI_COLORS } from '../../../constants';
import * as Fonts from '../../../utils/Fonts';

import type { Children, Style } from '../../../types/react';

type Props = {
  labelText: string,
  children?: ?Children,
  style?: ?Style,
  isValid: boolean,
};

const styles = {
  container: {
    flex: 1,
    minHeight: 75,
  },
  inside: (isValid: boolean) => ({
    flex: 1,
    borderWidth: 1,
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderRadius: 7,
    paddingHorizontal: 20,
    ...(isValid
      ? {
          backgroundColor: UI_COLORS.EXTRA_LIGHT_GREY,
        }
      : {
          backgroundColor: UI_COLORS.MEDIUM_RED,
        }),
  }),
  label: {
    ...Fonts.getFontStyle('form-label'),
    marginBottom: 7,
  },
};

export default function FormField({
  style,
  labelText,
  children,
  isValid,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{labelText}</Text>
      <View style={styles.inside(isValid)}>{children}</View>
    </View>
  );
}
