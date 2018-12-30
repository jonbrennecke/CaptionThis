// @flow
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { UI_COLORS } from '../../constants';
import * as Color from '../../utils/Color';
import * as Fonts from '../../utils/Fonts';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  onBackButtonPress: () => void,
};

const styles = {
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  buttonText: {
    ...Fonts.getFontStyle('button', { contentStyle: 'lightContent' }),
    textShadowColor: Color.hexToRgbaString(UI_COLORS.DARK_GREY, 0.5),
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
};

export default function EditScreenTopControls({
  style,
  onBackButtonPress,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={onBackButtonPress}>
        <Text numberOfLines={1} style={styles.buttonText}>
          {'< BACK'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
