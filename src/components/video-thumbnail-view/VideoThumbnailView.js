// @flow
import React from 'react';
import { View, requireNativeComponent } from 'react-native';

import type { Style } from '../../types/react';
import type { VideoAssetIdentifier } from '../../types/media';

const NativeVideoThumbnailView = requireNativeComponent('VideoThumbnailView');

type Props = {
  style?: ?Style,
  id: VideoAssetIdentifier,
};

const styles = {
  container: {},
  nativeView: {
    flex: 1,
    overflow: 'hidden',
  },
};

export default function VideoThumbnailView({ style, id }: Props) {
  return (
    <View style={[styles.container, style]}>
      <NativeVideoThumbnailView
        style={styles.nativeView}
        localIdentifier={id}
      />
    </View>
  );
}
