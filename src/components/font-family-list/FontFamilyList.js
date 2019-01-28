// @flow
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import * as Fonts from '../../utils/Fonts';
import { TEXT_COLORS, FONTS } from '../../constants';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  fontFamily: string,
  onDidSelectFontFamily: string => void,
};

const styles = {
  container: {
    paddingVertical: 4,
    flexDirection: 'row',
  },
  verticallyCenterTextHelper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fontFamilyText: (fontFamily: string, isSelected: boolean) => ({
    ...Fonts.getFontStyle('default', {
      contentStyle: 'darkContent',
    }),
    fontSize: 17,
    lineHeight: 17,
    justifyContent: 'center',
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
            <View style={styles.verticallyCenterTextHelper}>
              <Text
                numberOfLines={1}
                style={[styles.fontFamilyText(fontFamily, isUserSelectedFont)]}
              >
                {displayName}
              </Text>
            </View>
            <View style={styles.borderBottom(isUserSelectedFont)} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
