// @flow
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import * as Screens from '../../utils/Screens';
import * as Fonts from '../../utils/Fonts';
import { UI_COLORS } from '../../constants';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
};

const styles = {
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  labelText: {
    ...Fonts.getFontStyle('formLabel', { contentStyle: 'lightContent' }),
    marginBottom: 4,
  },
  backgroundColor: {
    backgroundColor: UI_COLORS.DARK_GREY,
    height: 45,
    borderRadius: 10,
  },
};

export default function EditScreenFontColorControls({ style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text numberOfLines={1} style={styles.labelText}>
        {'TEXT COLOR'}
      </Text>
      <TouchableOpacity onPress={() => Screens.showColorModal()}>
        <View style={styles.backgroundColor} />
      </TouchableOpacity>
    </View>
  );
}
