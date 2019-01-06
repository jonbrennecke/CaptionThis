// @flow
import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';

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
  },
  labelText: {
    ...Fonts.getFontStyle('formLabel', { contentStyle: 'darkContent' }),
    marginBottom: 7,
    paddingHorizontal: 7,
  },
  fontSize: {
    paddingVertical: 12,
    alignItems: 'flex-start',
    paddingHorizontal: 15,
  },
  fontSizeText: (isSelected: boolean) => ({
    ...Fonts.getFontStyle('heading', {
      contentStyle: 'darkContent',
    }),
    color: isSelected ? TEXT_COLORS.OFF_WHITE : TEXT_COLORS.LIGHT_GREY,
  }),
  borderBottom: (isSelected: boolean) => ({
    position: 'absolute',
    bottom: 4,
    left: 7,
    right: 7,
    height: 3,
    backgroundColor: isSelected ? TEXT_COLORS.OFF_WHITE : 'transparent',
  }),
  fontSizeList: {
    flexDirection: 'row',
    paddingVertical: 4,
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
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        overScrollMode="always"
      >
        <View style={styles.fontSizeList}>
          {FONT_SIZES.map(size => {
            const isSelected = size === fontSize;
            return (
              <TouchableOpacity
                key={size}
                style={styles.fontSize}
                onPress={() => onDidSelectFontSize(size)}
              >
                <Text numberOfLines={1} style={styles.fontSizeText(isSelected)}>
                  {size}
                </Text>
                <View style={styles.borderBottom(isSelected)} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
