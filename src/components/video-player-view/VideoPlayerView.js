// @flow
import React, { Component } from 'react';
import { View, requireNativeComponent, NativeModules } from 'react-native';

import type { Style } from '../../types/react';
import type { VideoAssetIdentifier } from '../../types/media';

const NativeVideoPlayerView = requireNativeComponent('VideoPlayerView');
const { VideoPlayerViewManager } = NativeModules;

type ReactNativeFiberHostComponent = any;

type Props = {
  style?: ?Style,
  isPlaying: boolean,
  videoAssetIdentifier: VideoAssetIdentifier,
  onVideoDidFailToLoad: () => void,
  onVideoDidBecomeReadyToPlay: (duration: number) => void,
  onVideoDidPause: () => void,
  onVideoDidUpdatePlaybackTime: (
    playbackTime: number,
    duration: number
  ) => void,
  onVideoDidRestart: () => void,
};

const styles = {
  container: {},
  nativeView: {
    flex: 1,
    borderRadius: 3,
    overflow: 'hidden',
  },
};

export default class VideoPlayerView extends Component<Props> {
  nativeComponentRef: ?ReactNativeFiberHostComponent;

  seekToTime(time: number) {
    if (!this.nativeComponentRef) {
      return;
    }
    VideoPlayerViewManager.seekToTime(this.nativeComponentRef._nativeTag, time);
  }

  restart() {
    if (!this.nativeComponentRef) {
      return;
    }
    VideoPlayerViewManager.restart(this.nativeComponentRef._nativeTag);
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <NativeVideoPlayerView
          ref={ref => {
            this.nativeComponentRef = ref;
          }}
          style={styles.nativeView}
          isPlaying={this.props.isPlaying}
          localIdentifier={this.props.videoAssetIdentifier}
          onVideoDidBecomeReadyToPlay={({ nativeEvent }) => {
            if (!nativeEvent) {
              return;
            }
            this.props.onVideoDidBecomeReadyToPlay(nativeEvent.duration);
          }}
          onVideoDidFailToLoad={this.props.onVideoDidFailToLoad}
          onVideoDidPause={this.props.onVideoDidPause}
          onVideoDidUpdatePlaybackTime={({ nativeEvent }) => {
            if (!nativeEvent) {
              return;
            }
            const { playbackTime, duration } = nativeEvent;
            this.props.onVideoDidUpdatePlaybackTime(playbackTime, duration);
          }}
          onVideoDidRestart={this.props.onVideoDidRestart}
        />
      </View>
    );
  }
}
