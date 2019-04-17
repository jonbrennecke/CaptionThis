// @flow
import React, { Component } from 'react';
import Bluebird from 'bluebird';
import { autobind } from 'core-decorators';
import { View, requireNativeComponent, NativeModules } from 'react-native';

import type { Style } from '../../types/react';
import type { Size, VideoAssetIdentifier, Orientation } from '../../types/media';

const NativeVideoPlayerView = requireNativeComponent('VideoPlayerView');
const { VideoPlayerViewManager: _VideoPlayerViewManager } = NativeModules;
const VideoPlayerViewManager = Bluebird.promisifyAll(_VideoPlayerViewManager);

type ReactNativeFiberHostComponent = any;

type Props = {
  style?: ?Style,
  videoAssetIdentifier: VideoAssetIdentifier,
  onVideoDidFailToLoad: () => void,
  onVideoDidBecomeReadyToPlay: (
    duration: number,
    orientation: Orientation
  ) => void,
  onVideoDidPause: () => void,
  onVideoDidUpdatePlaybackTime: (
    playbackTime: number,
    duration: number
  ) => void,
  onVideoDidRestart: () => void,
  onViewDidResize: Size => void,
};

const styles = {
  container: {},
  nativeView: {
    flex: 1,
    borderRadius: 3,
    overflow: 'hidden',
  },
};

// $FlowFixMe
@autobind
export default class VideoPlayerView extends Component<Props> {
  nativeComponentRef: ?ReactNativeFiberHostComponent;

  async seekToTime(time: number) {
    if (!this.nativeComponentRef) {
      return;
    }
    await VideoPlayerViewManager.seekToTimeAsync(
      this.nativeComponentRef._nativeTag,
      time
    );
  }

  pause() {
    if (!this.nativeComponentRef) {
      return;
    }
    VideoPlayerViewManager.pause(this.nativeComponentRef._nativeTag);
  }

  restart() {
    if (!this.nativeComponentRef) {
      return;
    }
    VideoPlayerViewManager.restart(this.nativeComponentRef._nativeTag);
  }

  play() {
    if (!this.nativeComponentRef) {
      return;
    }
    VideoPlayerViewManager.play(this.nativeComponentRef._nativeTag);
  }

  viewDidLayout({ nativeEvent: { layout } }: any) {
    const viewSize = {
      width: layout.width,
      height: layout.height,
    };
    this.props.onViewDidResize(viewSize);
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]} onLayout={this.viewDidLayout}>
        <NativeVideoPlayerView
          ref={ref => {
            this.nativeComponentRef = ref;
          }}
          style={styles.nativeView}
          localIdentifier={this.props.videoAssetIdentifier}
          onVideoDidBecomeReadyToPlay={({ nativeEvent }) => {
            if (!nativeEvent) {
              return;
            }
            const { orientation, duration } = nativeEvent;
            this.props.onVideoDidBecomeReadyToPlay(duration, orientation);
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
