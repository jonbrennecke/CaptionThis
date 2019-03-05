// @flow
import React from 'react';
import { ScrollView, View, Dimensions } from 'react-native';

import { UI_COLORS } from '../../constants';
import CaptionPresetStyleView from './CaptionPresetStyleView';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PRESET_WIDTH = 50;
const PRESET_HEIGHT = 50;

const styles = {
  container: {
    flexDirection: 'row',
    backgroundColor: UI_COLORS.DARK_GREY,
  },
  captionPreset: (isFirst: boolean) => ({
    height: PRESET_HEIGHT,
    width: PRESET_WIDTH,
    marginLeft: isFirst ? 0 : 5,
    marginRight: 5,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 6,
    padding: 5,
  }),
  leftPadding: {
    width: (SCREEN_WIDTH - PRESET_WIDTH) / 2,
  }
};

export default function CaptionPresetStylesPicker({ style }: Props) {
  return (
    <ScrollView horizontal style={[styles.container, style]}>
      <View style={styles.leftPadding} />
      <CaptionPresetStyleView
        style={styles.captionPreset(true)}
        textAlignment="left"
        lineStyle="translateY"
        wordStyle="animated"
      />
      <CaptionPresetStyleView
        style={styles.captionPreset(false)}
        textAlignment="right"
        lineStyle="translateY"
        wordStyle="animated"
      />
      <CaptionPresetStyleView
        style={styles.captionPreset(false)}
        textAlignment="center"
        lineStyle="translateY"
        wordStyle="animated"
      />
      <CaptionPresetStyleView
        style={styles.captionPreset(false)}
        textAlignment="center"
        lineStyle="fadeInOut"
        wordStyle="none"
      />
      <CaptionPresetStyleView
        style={styles.captionPreset(false)}
        textAlignment="left"
        lineStyle="fadeInOut"
        wordStyle="none"
      />
      <CaptionPresetStyleView
        style={styles.captionPreset(false)}
        textAlignment="right"
        lineStyle="fadeInOut"
        wordStyle="none"
      />
    </ScrollView>
  );
}
