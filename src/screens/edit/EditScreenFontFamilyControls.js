// @flow
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import * as Fonts from '../../utils/Fonts';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  fontFamily: string,
  onRequestShowFontFamilySelection: () => void,
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
  buttonText: Fonts.getFontStyle('heading', {
    contentStyle: 'darkContent',
  }),
};

export default function EditScreenFontFamilyControls({
  style,
  fontFamily,
  onRequestShowFontFamilySelection,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={onRequestShowFontFamilySelection}>
        <Text numberOfLines={1} style={styles.labelText}>
          {'Font'}
        </Text>
        <Text numberOfLines={1} style={[styles.buttonText, { fontFamily }]}>
          {fontFamily}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
