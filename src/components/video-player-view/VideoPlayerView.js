// @flow
import React from 'react';
import { View, requireNativeComponent } from 'react-native';

import type { Style } from '../../types/react';
import type { VideoAssetIdentifier } from '../../types/media';

const NativeVideoPlayerView = requireNativeComponent('VideoPlayerView');

type Props = {
  style?: ?Style,
  videoAssetIdentifier: VideoAssetIdentifier,
};

const styles = {
  container: {},
  nativeView: {
    flex: 1,
    borderRadius: 3,
    overflow: 'hidden',
  },
};

export default function VideoPlayerView({
  style,
  videoAssetIdentifier,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <NativeVideoPlayerView
        style={styles.nativeView}
        localIdentifier={videoAssetIdentifier}
      />
    </View>
  );
}
