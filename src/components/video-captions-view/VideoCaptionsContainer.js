// @flow
import React from 'react';
import { View } from 'react-native';

import { isLandscape } from '../../utils/Orientation';

import type { Style, Children } from '../../types/react';
import type { Orientation, Size } from '../../types/media';

type Props = {
  style?: ?Style,
  children?: ?Children,
  orientation?: Orientation,
  videoPlayerViewSize?: Size,
};

const CAPTION_VIEW_HEIGHT_PORTRAIT = 85;
const CAPTION_VIEW_OFFSET_FROM_BOTTOM = 75;

const styles = {
  container: {},
  captionsWrap: (orientation: Orientation, videoPlayerViewSize: Size) => {
    if (isLandscape(orientation)) {
      const videoHeight = videoPlayerViewSize.width * 9 / 16;
      const bottomOfVideo = (videoPlayerViewSize.height - videoHeight) / 2;
      const heightRatio = videoHeight / videoPlayerViewSize.height;
      return {
        position: 'absolute',
        left: 0,
        right: 0,
        height: CAPTION_VIEW_HEIGHT_PORTRAIT * heightRatio,
        bottom: bottomOfVideo + CAPTION_VIEW_OFFSET_FROM_BOTTOM * heightRatio,
      };
    } else {
      return {
        position: 'absolute',
        left: 0,
        right: 0,
        height: CAPTION_VIEW_HEIGHT_PORTRAIT,
        bottom: 0,
      };
    }
  },
};

export default function VideoCaptionsContainer({
  style,
  children,
  orientation = 'up',
  videoPlayerViewSize = { height: 0, width: 0 },
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.captionsWrap(orientation, videoPlayerViewSize)}>
        {children}
      </View>
    </View>
  );
}
