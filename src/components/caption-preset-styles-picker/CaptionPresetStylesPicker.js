// @flow
import React from 'react';
import { ScrollView } from 'react-native';

import CaptionPresetStyleView from './CaptionPresetStyleView';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
};

const styles = {
  container: {
    flexDirection: 'row',
  },
  captionPreset: (isFirst: boolean) => ({
    height: 50,
    width: 50,
    marginLeft: isFirst ? 0 : 5,
    marginRight: 5,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 6,
    padding: 5,
  }),
};

export default function CaptionPresetStylesPicker({ style }: Props) {
  return (
    <ScrollView horizontal style={[styles.container, style]}>
      <CaptionPresetStyleView
        style={styles.captionPreset(true)}
        textAlignment="center"
        lineStyle="fadeInOut"
        wordStyle="none"
      />
      <CaptionPresetStyleView
        style={styles.captionPreset(false)}
        textAlignment="left"
        lineStyle="translateY"
        wordStyle="none"
      />
      <CaptionPresetStyleView
        style={styles.captionPreset(false)}
        textAlignment="right"
        lineStyle="fadeInOut"
        wordStyle="none"
      />
      <CaptionPresetStyleView
        style={styles.captionPreset(false)}
        textAlignment="left"
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
        textAlignment="right"
        lineStyle="translateY"
        wordStyle="animated"
      />
    </ScrollView>
  );
}
