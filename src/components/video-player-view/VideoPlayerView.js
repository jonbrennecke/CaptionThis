// @flow
import React from 'react';
import { View, requireNativeComponent } from 'react-native';

import type { Style } from '../../types/react';
import type { VideoAssetIdentifier } from '../../types/media';

const NativeVideoPlayerView = requireNativeComponent('VideoPlayerView');

type Props = {
  style?: ?Style,
  startPosition: number,
  videoAssetIdentifier: VideoAssetIdentifier,
  onVideoDidFailToLoad: () => void,
  onVideoDidBecomeReadyToPlay: (duration: number) => void,
  onVideoDidPause: () => void,
  onVideoDidUpdatePlaybackTime: (
    playbackTime: number,
    duration: number
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
  onVideoDidPause,
  onVideoDidUpdatePlaybackTime,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <NativeVideoPlayerView
        style={styles.nativeView}
        startPosition={startPosition}
        localIdentifier={videoAssetIdentifier}
        onVideoDidBecomeReadyToPlay={({ nativeEvent }) => {
          if (!nativeEvent) {
            return;
          }
          onVideoDidBecomeReadyToPlay(nativeEvent.duration);
        }}
        onVideoDidFailToLoad={onVideoDidFailToLoad}
        onVideoDidPause={onVideoDidPause}
        onVideoDidUpdatePlaybackTime={({ nativeEvent }) => {
          if (!nativeEvent) {
            return;
          }
          const { playbackTime, duration } = nativeEvent;
          onVideoDidUpdatePlaybackTime(playbackTime, duration);
        }}
      />
    </View>
  );
}
