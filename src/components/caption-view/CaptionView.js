// @flow
import React from 'react';
import { View, requireNativeComponent } from 'react-native';

import * as Color from '../../utils/Color';

import type { Style } from '../../types/react';
import type { CaptionStyleObject } from '../../types/video';
import type { TextSegmentObject } from '../../types/media';

const NativeCaptionView = requireNativeComponent('CaptionView');

type Props = {
  style?: ?Style,
  duration: number,
  textSegments: TextSegmentObject[],
  captionStyle: CaptionStyleObject,
};

const styles = {
  container: {},
  nativeView: {
    flex: 1,
    overflow: 'hidden',
  },
};

export default function CaptionView({
  style,
  duration,
  textSegments,
  captionStyle,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <NativeCaptionView
        style={styles.nativeView}
        duration={duration}
        textSegments={textSegments}
        textAlignment={captionStyle.textAlignment}
        lineStyle={captionStyle.lineStyle}
        wordStyle={captionStyle.wordStyle}
        backgroundStyle={captionStyle.backgroundStyle}
        fontSize={captionStyle.fontSize}
        fontFamily={captionStyle.fontFamily}
        backgroundColor={Color.transformRgbaObjectForNativeBridge(
          captionStyle.backgroundColor
        )}
        textColor={Color.transformRgbaObjectForNativeBridge(
          captionStyle.textColor
        )}
      />
    </View>
  );
}
