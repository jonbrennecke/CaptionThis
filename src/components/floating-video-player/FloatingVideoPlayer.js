// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VideoPlayer } from '@jonbrennecke/react-native-media';
import noop from 'lodash/noop';

import { Draggable } from '../draggable';
import { Units, Colors } from '../../constants';

import type { SFC, Style } from '../../types';

export type FloatingVideoPlayerProps = {
  style?: ?Style,
  videoID: string,
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
    shadowOpacity: 0.1,
    shadowRadius: 25,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
};

export const FloatingVideoPlayer: SFC<FloatingVideoPlayerProps> = ({
  style,
  videoID,
}: FloatingVideoPlayerProps) => (
  <Draggable
    style={[styles.draggable, style]}
    contentContainerStyle={styles.draggableContentContainer}
  >
    <VideoPlayer
      style={styles.absoluteFill}
      videoID={videoID}
      onVideoDidBecomeReadyToPlay={noop}
      onVideoDidFailToLoad={noop}
      onVideoDidPause={noop}
      onVideoDidRestart={noop}
      onVideoDidUpdatePlaybackTime={noop}
      onViewDidResize={noop}
    />
  </Draggable>
);
