// @flow
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { UI_COLORS, TEXT_COLORS, FONT_FAMILIES } from '../../constants';
import * as Color from '../../utils/Color';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  onPress: () => void,
};

const styles = {
  container: {
    shadowColor: UI_COLORS.BLACK,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowRadius: 15,
  },
  buttonInside: {
    flex: 1,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: UI_COLORS.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  richTextButton: {
    fontFamily: FONT_FAMILIES.SOURCE_SANS_PRO,
    fontWeight: 'bold',
    fontSize: 23,
    textShadowRadius: 3,
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    color: TEXT_COLORS.WHITE,
    textShadowColor: Color.hexToRgbaString(UI_COLORS.DARK_GREY, 0.2),
  },
};

export default function EditScreenRichTextButton({ style, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <View style={styles.buttonInside}>
        <LinearGradient
          pointerEvents="none"
          useAngle
          angle={-45}
          angleCenter={{ x: 0.5, y: 0.5 }}
          colors={[UI_COLORS.LIGHT_GREEN, UI_COLORS.MEDIUM_GREEN]}
          style={styles.absoluteFill}
        />
        <Text style={styles.richTextButton}>Aa</Text>
      </View>
    </TouchableOpacity>
  );
}
