// @flow
import React from 'react';
import { View, Text } from 'react-native';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';

import type { Style } from '../../types/react';

type Props = {
  style: ?Style,
  text: string,
};

const styles = {
  container: {
    backgroundColor: UI_COLORS.DARK_GREY,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  text: Fonts.getFontStyle('heading', {
    contentStyle: 'lightContent',
    size: 'large',
  }),
};

export default function TranscriptionView({ style, text }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}
