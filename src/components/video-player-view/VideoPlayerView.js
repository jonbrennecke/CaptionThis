// @flow
import React from 'react';
import { View, requireNativeComponent } from 'react-native';

import type { Style } from '../../types/react';
import type { VideoAssetIdentifier } from '../../types/media';

const NativeVideoPlayerView = requireNativeComponent('VideoPlayerView');

type VideoDidBecomeReadyToPlayParams = {
  duration: number,
};

type Props = {
  style?: ?Style,
  startPosition: number,
  videoAssetIdentifier: VideoAssetIdentifier,
  onVideoDidFailToLoad: () => void,
  onVideoDidBecomeReadyToPlay: (
    params: VideoDidBecomeReadyToPlayParams
  ) => void,
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
  startPosition,
  videoAssetIdentifier,
  onVideoDidBecomeReadyToPlay,
  onVideoDidFailToLoad,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <NativeVideoPlayerView
        style={styles.nativeView}
        startPosition={startPosition}
        localIdentifier={videoAssetIdentifier}
        onVideoDidBecomeReadyToPlay={({ nativeEvent }) =>
          onVideoDidBecomeReadyToPlay(nativeEvent)
        }
        onVideoDidFailToLoad={onVideoDidFailToLoad}
      />
    </View>
  );
}
