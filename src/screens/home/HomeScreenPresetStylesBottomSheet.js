// @flow
import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import * as Color from '../../utils/Color';
import { UI_COLORS } from '../../constants';
import CaptionPresetStylesPicker from '../../components/caption-preset-styles-picker/CaptionPresetStylesPicker';
import BottomSheetAnimatedView from '../../components/animations/BottomSheetAnimatedView';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  isVisible: boolean,
};

const styles = {
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    backgroundColor: UI_COLORS.DARK_GREY,
    paddingTop: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  presets: {
    flex: 1,
  },
  leftGradient: {
    ...StyleSheet.absoluteFillObject,
    width: 50,
  },
  rightGradient: {
    // ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 50,
  }
};

export default function HomeScreenPresetStylesBottomSheet({
  style,
  isVisible
}: Props) {
  const colorHex = UI_COLORS.DARK_GREY;
  return (
    <BottomSheetAnimatedView isVisible={isVisible} style={[styles.container, style]}>
      <CaptionPresetStylesPicker style={styles.presets} />
      <LinearGradient
        pointerEvents="none"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[
          Color.hexToRgbaString(colorHex, 1),
          Color.hexToRgbaString(colorHex, 0.0),
        ]}
        style={styles.leftGradient}
      />
      <LinearGradient
        pointerEvents="none"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[
          Color.hexToRgbaString(colorHex, 0.0),
          Color.hexToRgbaString(colorHex, 1),
        ]}
        style={styles.rightGradient}
      />
    </BottomSheetAnimatedView>
  );
}
