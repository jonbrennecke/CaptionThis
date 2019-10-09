// @flow
import React from 'react';
import { View } from 'react-native';
import { VideoPlayer } from '@jonbrennecke/react-native-media';
import ReactNativeHaptic from 'react-native-haptic';
import noop from 'lodash/noop';

import { Draggable } from '../draggable';
import { Units, Colors } from '../../constants';
import { MinimizeButton } from './MinimizeButton';

import type { createRef } from 'react';
import type { Size, PlaybackState } from '@jonbrennecke/react-native-media';

import type { SFC, Style, Return } from '../../types';

export type FloatingVideoPlayerProps = {
  style?: ?Style,
  videoID: string,
  // $FlowFixMe
  videoPlayerRef?: Return<createRef<VideoPlayer>>,
  initialPosition?: { x: number, y: number },
  onVideoDidUpdatePlaybackTime?: (
    playbackTime: number,
    duration: number
  ) => void,
  onVideoWillRestart?: () => void,
  onViewDidResize?: Size => void,
  onPlaybackStateChange?: PlaybackState => void,
};

const styles = {
  flex: {
    flex: 1
  },
  draggable: {},
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
    width: 100,
    height: 16 / 9 * 100,
  },
  videoPlayerContainer: {
    flex: 1,
    borderWidth: 3,
    borderColor: Colors.solid.white,
    borderRadius: Units.extraSmall,
  },
  minimizeButton: {
    position: 'absolute',
    top: Units.extraSmall,
    right: Units.extraSmall,
  }
};

function hapticFeedback() {
  ReactNativeHaptic.generate('selection');
}

export const FloatingVideoPlayer: SFC<FloatingVideoPlayerProps> = ({
  style,
  videoID,
  videoPlayerRef,
  initialPosition,
  onVideoDidUpdatePlaybackTime = noop,
  onPlaybackStateChange = noop,
  onVideoWillRestart = noop,
}: FloatingVideoPlayerProps) => (
  <Draggable
    style={[styles.draggable, style]}
    initialPosition={initialPosition}
    contentContainerStyle={styles.draggableContentContainer}
    onDragStart={hapticFeedback}
    onDragEnd={hapticFeedback}
  >
    <View style={styles.videoPlayerContainer}>
      <VideoPlayer
        style={styles.flex}
        videoID={videoID}
        ref={videoPlayerRef}
        onPlaybackStateChange={onPlaybackStateChange}
        onVideoDidUpdatePlaybackTime={onVideoDidUpdatePlaybackTime}
        onVideoWillRestart={onVideoWillRestart}
      />
      <MinimizeButton
        style={styles.minimizeButton}
        onPress={() => { /* TODO */}}
      />
    </View>
  </Draggable>
);
