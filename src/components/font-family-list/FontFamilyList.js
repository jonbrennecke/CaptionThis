// @flow
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import * as Fonts from '../../utils/Fonts';
import { UI_COLORS, FONTS } from '../../constants';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  onDidSelectFontFamily: string => void,
};

const FONT_EXAMPLE_TEXT = 'The quick brown fox jumps over the lazy dog';

const styles = {
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  fontFamilyText: Fonts.getFontStyle('formLabel', {
    contentStyle: 'darkContent',
    marginBottom: 5,
  }),
  fontExampleText: {
    ...Fonts.getFontStyle('button', {
      contentStyle: 'darkContent',
    }),
  },
  font: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: UI_COLORS.LIGHT_GREY,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
};

export default function FontFamilyList({
  style,
  onDidSelectFontFamily,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      {FONTS.map(({ displayName, fontFamily }) => (
        <TouchableOpacity
          onPress={() => onDidSelectFontFamily(fontFamily)}
          style={styles.font}
          key={fontFamily}
        >
          <Text
            numberOfLines={1}
            style={[styles.fontFamilyText, { fontFamily }]}
          >
            {displayName}
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.fontExampleText, { fontFamily }]}
          >
            {FONT_EXAMPLE_TEXT}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
