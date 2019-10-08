// @flow
import React from 'react';
import { StyleSheet } from 'react-native';
import { VideoPlayer } from '@jonbrennecke/react-native-media';
import noop from 'lodash/noop';

import { Draggable } from '../draggable';
import { Units, Colors } from '../../constants';

import type { createRef } from 'react';
import type { Orientation, Size } from '@jonbrennecke/react-native-media';

import type { SFC, Style, Return } from '../../types';

export type FloatingVideoPlayerProps = {
  style?: ?Style,
  videoID: string,
  videoPlayerRef?: Return<createRef<VideoPlayer>>,
  onVideoDidFailToLoad?: () => void,
  onVideoDidBecomeReadyToPlay?: (
    duration: number,
    orientation: Orientation
  ) => void,
  onVideoDidPause?: () => void,
  onVideoDidUpdatePlaybackTime?: (
    playbackTime: number,
    duration: number
  ) => void,
  onVideoDidRestart?: () => void,
  onViewDidResize?: Size => void,
};

const styles = {
  absoluteFill: StyleSheet.absoluteFillObject,
  draggable: {
    width: 100,
    height: 16 / 9 * 100,
  },
  draggableContentContainer: {
    backgroundColor: Colors.solid.white,
    borderRadius: Units.extraSmall,
    shadowColor: Colors.solid.darkGray,
    shadowOpacity: 0.35,
    shadowRadius: 7,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  videoPlayer: {
    flex: 1,
    borderWidth: 3,
    borderColor: Colors.solid.white,
    borderRadius: Units.extraSmall,
  },
};

export const FloatingVideoPlayer: SFC<FloatingVideoPlayerProps> = ({
  style,
  videoID,
  videoPlayerRef,
  onVideoDidBecomeReadyToPlay = noop,
  onVideoDidFailToLoad = noop,
  onVideoDidPause = noop,
  onVideoDidRestart = noop,
  onVideoDidUpdatePlaybackTime = noop,
  onViewDidResize = noop,
}: FloatingVideoPlayerProps) => (
  <Draggable
    style={[styles.draggable, style]}
    contentContainerStyle={styles.draggableContentContainer}
  >
    <VideoPlayer
      style={styles.videoPlayer}
      videoID={videoID}
      ref={videoPlayerRef}
      onVideoDidBecomeReadyToPlay={onVideoDidBecomeReadyToPlay}
      onVideoDidFailToLoad={onVideoDidFailToLoad}
      onVideoDidPause={onVideoDidPause}
      onVideoDidRestart={onVideoDidRestart}
      onVideoDidUpdatePlaybackTime={onVideoDidUpdatePlaybackTime}
      onViewDidResize={onViewDidResize}
    />
  </Draggable>
);
