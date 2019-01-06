// @flow
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import * as Fonts from '../../utils/Fonts';
import { UI_COLORS, TEXT_COLORS, FONTS } from '../../constants';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  fontFamily: string,
  onDidSelectFontFamily: string => void,
};

const styles = {
  container: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  fontFamilyText: (fontFamily: string, isSelected: boolean) => ({
    ...Fonts.getFontStyle('default', {
      contentStyle: 'darkContent',
    }),
    fontSize: 17,
    fontFamily,
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
  font: {
    borderColor: UI_COLORS.LIGHT_GREY,
    paddingVertical: 12,
    alignItems: 'flex-start',
    paddingHorizontal: 15,
  },
};

export default function FontFamilyList({
  style,
  fontFamily: currentFontFamily,
  onDidSelectFontFamily,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      {FONTS.sort().map(({ displayName, fontFamily }) => {
        const isUserSelectedFont = currentFontFamily === fontFamily;
        return (
          <TouchableOpacity
            onPress={() => onDidSelectFontFamily(fontFamily)}
            style={styles.font}
            key={fontFamily}
          >
            <Text
              numberOfLines={1}
              style={[styles.fontFamilyText(fontFamily, isUserSelectedFont)]}
            >
              {displayName}
            </Text>
            <View style={styles.borderBottom(isUserSelectedFont)} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
