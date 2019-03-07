// @flow
import React from 'react';
import { View, requireNativeComponent } from 'react-native';

import type { Style } from '../../types/react';
import type { CaptionPresetStyleObject } from '../../types/video';

const NativeCaptionPresetStyleView = requireNativeComponent(
  'CaptionPresetStyleView'
);

type Props = {
  style?: ?Style,
  presetStyle: CaptionPresetStyleObject,
};

const styles = {
  container: {},
  nativeView: {
    flex: 1,
    overflow: 'hidden',
  },
};

export default function CaptionPresetStyleView({ style, presetStyle }: Props) {
  return (
    <View style={[styles.container, style]}>
      <NativeCaptionPresetStyleView
        style={styles.nativeView}
        textAlignment={presetStyle.textAlignment}
        lineStyle={presetStyle.lineStyle}
        wordStyle={presetStyle.wordStyle}
        backgroundStyle={presetStyle.backgroundStyle}
        backgroundColor={[
          presetStyle.backgroundColor.red / 255,
          presetStyle.backgroundColor.green / 255,
          presetStyle.backgroundColor.blue / 255,
          presetStyle.backgroundColor.alpha,
        ]}
      />
    </View>
  );
}
