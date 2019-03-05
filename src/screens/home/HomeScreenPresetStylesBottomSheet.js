// @flow
import React from 'react';
import { View } from 'react-native';

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
  }
};

export default function HomeScreenPresetStylesBottomSheet({
  style,
  isVisible
}: Props) {
  return (
    <BottomSheetAnimatedView isVisible={isVisible} style={[styles.container, style]}>
      <CaptionPresetStylesPicker style={styles.presets} />
    </BottomSheetAnimatedView>
  );
}
