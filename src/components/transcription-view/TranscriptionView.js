// @flow
import React from 'react';
import { View, Text } from 'react-native';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import * as Color from '../../utils/Color';

import type { Style } from '../../types/react';

type Props = {
  style: ?Style,
  text: string,
  fontFamily: string,
};

const styles = {
  container: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  text: {
    ...Fonts.getFontStyle('heading', {
      contentStyle: 'lightContent',
      size: 'large',
    }),
    textShadowColor: Color.hexToRgbaString(UI_COLORS.BLACK, 0.5),
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 2,
  },
};

export default function TranscriptionView({ style, text, fontFamily }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, { fontFamily }]}>{text}</Text>
    </View>
  );
}
