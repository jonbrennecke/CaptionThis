// @flow
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import * as Fonts from '../../utils/Fonts';
import { FONT_SIZES, TEXT_COLORS } from '../../constants';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  fontSize: number,
  onDidSelectFontSize: number => void,
};

const styles = {
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  labelText: {
    ...Fonts.getFontStyle('formLabel', { contentStyle: 'darkContent' }),
    marginBottom: 4,
  },
  fontSizeText: (isSelected: boolean, isFirst: boolean) => ({
    paddingLeft: isFirst ? 0 : 8,
    paddingRight: 8,
    ...Fonts.getFontStyle('heading', {
      contentStyle: 'darkContent',
    }),
    color: isSelected ? TEXT_COLORS.DARK_GREY : TEXT_COLORS.LIGHT_GREY,
  }),
  fontSizes: {
    flexDirection: 'row',
  },
};

export default function RichTextFontSizeControl({
  style,
  fontSize,
  onDidSelectFontSize,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text numberOfLines={1} style={styles.labelText}>
        {'Size'}
      </Text>
      <View style={styles.fontSizes}>
        {FONT_SIZES.map((size, index) => (
          <TouchableOpacity
            key={size}
            onPress={() => onDidSelectFontSize(size)}
          >
            <Text
              numberOfLines={1}
              style={styles.fontSizeText(size === fontSize, index === 0)}
            >
              {size}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
