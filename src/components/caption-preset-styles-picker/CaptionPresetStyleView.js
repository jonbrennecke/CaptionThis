// @flow
import React from 'react';
import { View, requireNativeComponent } from 'react-native';

import type { Style } from '../../types/react';
import type { CaptionPresetStyleObject } from '../../types/video';
import type { TextSegmentObject } from '../../types/media';

const NativeCaptionPresetStyleView = requireNativeComponent(
  'CaptionPresetStyleView'
);

type Props = {
  style?: ?Style,
  textSegments: TextSegmentObject[],
  presetStyle: CaptionPresetStyleObject,
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
  textSegments,
  presetStyle,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <NativeCaptionPresetStyleView
        style={styles.nativeView}
        textSegments={textSegments}
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
