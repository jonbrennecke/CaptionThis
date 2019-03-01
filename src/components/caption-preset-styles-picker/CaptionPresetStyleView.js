// @flow
import React from 'react';
import { View, requireNativeComponent } from 'react-native';

import type { Style } from '../../types/react';

const NativeCaptionPresetStyleView = requireNativeComponent(
  'CaptionPresetStyleView'
);

type Props = {
  style?: ?Style,
  textAlignment: 'center' | 'left' | 'right',
  lineStyle: 'fadeInOut' | 'translateY',
  wordStyle: 'animated' | 'none',
};

const styles = {
  container: {},
  nativeView: {
    flex: 1,
    overflow: 'hidden',
  },
};

export default function CaptionPresetStyleView({
  style,
  textAlignment,
  lineStyle,
  wordStyle,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <NativeCaptionPresetStyleView
        style={styles.nativeView}
        textAlignment={textAlignment}
        lineStyle={lineStyle}
        wordStyle={wordStyle}
      />
    </View>
  );
}
