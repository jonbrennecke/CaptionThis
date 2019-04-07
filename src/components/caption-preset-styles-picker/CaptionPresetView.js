// @flow
import React from 'react';
import { View, requireNativeComponent } from 'react-native';

import * as Color from '../../utils/Color';

import type { Style } from '../../types/react';
import type { CaptionPresetStyleObject } from '../../types/video';
import type { TextSegmentObject } from '../../types/media';

const NativeCaptionPresetView = requireNativeComponent('CaptionPresetView');

type Props = {
  style?: ?Style,
  duration: number,
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

export default function CaptionPresetView({
  style,
  duration,
  textSegments,
  presetStyle,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <NativeCaptionPresetView
        style={styles.nativeView}
        duration={duration}
        textSegments={textSegments}
        textAlignment={presetStyle.textAlignment}
        lineStyle={presetStyle.lineStyle}
        wordStyle={presetStyle.wordStyle}
        backgroundStyle={presetStyle.backgroundStyle}
        backgroundColor={Color.transformRgbaObjectForNativeBridge(
          presetStyle.backgroundColor
        )}
        fontFamily={presetStyle.fontFamily}
        textColor={Color.transformRgbaObjectForNativeBridge(
          presetStyle.textColor
        )}
      />
    </View>
  );
}
