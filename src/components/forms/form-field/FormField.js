// @flow
import React from 'react';
import { View, Text } from 'react-native';

import { UI_COLORS, TEXT_COLORS, FONTS, FONT_SIZES } from '../../../constants';

import type { Children, Style } from '../../../types/react';

type Props = {
  labelText: string,
  children?: ?Children,
  style?: ?Style,
};

const styles = {
  container: {
    flex: 1,
  },
  inside: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: UI_COLORS.EXTRA_LIGHT_GREY,
    borderColor: UI_COLORS.DARK_GREY,
    borderStyle: 'solid',
    borderRadius: 5,
    paddingHorizontal: 20,
  },
  label: {
    color: TEXT_COLORS.DARK_GREY,
    fontFamily: FONTS.PASSION_ONE,
    fontSize: FONT_SIZES.LABEL,
  },
};

export default function FormField({ style, labelText, children }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{labelText}</Text>
      <View style={styles.inside}>{children}</View>
    </View>
  );
}
