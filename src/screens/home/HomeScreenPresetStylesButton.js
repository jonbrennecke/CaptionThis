// @flow
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { UI_COLORS } from '../../constants';
import CaptionPresetStyleView from '../../components/caption-preset-styles-picker/CaptionPresetStyleView';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  onPress: () => void,
};

const styles = {
  container: {
    backgroundColor: 'transparent',
    shadowColor: UI_COLORS.BLACK,
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowRadius: 5,
    borderRadius: 5,
    borderWidth: 2.5,
    borderColor: UI_COLORS.WHITE,
  },
  buttonInside: {
    flex: 1,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: UI_COLORS.MEDIUM_GREEN,
  },
  flex: {
    flex: 1,
  },
  captionPreset: {
    flex: 1,
    padding: 4,
  },
};

export default function HomeScreePresetStylesButton({ style, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <CaptionPresetStyleView
        style={styles.captionPreset}
        textAlignment="left"
        lineStyle="translateY"
        wordStyle="animated"
      />
    </TouchableOpacity>
  );
}
