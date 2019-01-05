// @flow
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import * as Screens from '../../utils/Screens';
import * as Fonts from '../../utils/Fonts';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  fontFamily: string,
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
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={() => Screens.showFontModal()}>
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
