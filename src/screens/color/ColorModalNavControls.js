// @flow
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import type { Style } from '../../types/react';

import * as Fonts from '../../utils/Fonts';

type Props = {
  style?: ?Style,
  onBackButtonPress: () => void,
};

const styles = {
  container: {
    paddingVertical: 10,
    marginBottom: 15,
  },
  buttonText: Fonts.getFontStyle('button', { contentStyle: 'lightContent' }),
};

export default function ColorModalNavControls({
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
