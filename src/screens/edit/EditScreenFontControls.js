// @flow
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import * as Screens from '../../utils/Screens';

import type { Style } from '../../types/react';

import * as Fonts from '../../utils/Fonts';

type Props = {
  style?: ?Style,
  fontFamily: string,
};

const styles = {
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  labelText: Fonts.getFontStyle('formLabel', { contentStyle: 'lightContent' }),
  buttonText: Fonts.getFontStyle('button', {
    contentStyle: 'lightContent',
    size: 'large',
  }),
};

export default function EditScreenFontControls({ style, fontFamily }: Props) {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={() => Screens.showFontModal()}>
        <Text numberOfLines={1} style={styles.labelText}>
          {'FONT'}
        </Text>
        <Text numberOfLines={1} style={[styles.buttonText, { fontFamily }]}>
          {fontFamily}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
