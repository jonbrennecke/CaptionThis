// @flow
import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { SeekbarBackground } from '@jonbrennecke/react-native-media';

import { Colors, Units } from '../../constants';
import { Slider } from '../slider';

import type { PlaybackState } from '@jonbrennecke/react-native-camera';

import type { Style } from '../../types';

export type PlaybackSeekbarProps = {
  style?: ?Style,
  playbackState: PlaybackState,
  playbackProgress: number,
  assetID: ?string,
  onSeekToProgress: number => void,
  onRequestPlay: () => void,
  onRequestPause: () => void,
};

export type PlaybackSeekbarState = {
  playbackStateOnDragStart: ?PlaybackState,
};

const styles = {
  container: {
    height: 50,
  },
  scrollView: {
    flexDirection: 'row',
  },
  scrollViewContent: {},
  handle: {
    position: 'absolute',
    width: 5,
    top: -3,
    bottom: -3,
    left: -2.5,
    borderRadius: Units.extraSmall,
    backgroundColor: Colors.solid.white,
  },
  seekbarBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Units.extraSmall,
  }
};

export class PlaybackSeekbar extends PureComponent<
  PlaybackSeekbarProps,
  PlaybackSeekbarState
> {
  state = {
    playbackStateOnDragStart: null,
  };

  render() {
    const {
      style,
      assetID,
      playbackState,
      playbackProgress,
      onSeekToProgress,
      onRequestPlay,
      onRequestPause,
    } = this.props;
    return (
      <Slider
        style={[styles.container, style]}
        handleStyle={styles.handle}
        progress={playbackProgress}
        onSeekToProgress={onSeekToProgress}
        onDidBeginDrag={() => {
          this.setState({
            playbackStateOnDragStart: playbackState,
          });
          if (playbackState === 'playing') {
            onRequestPause();
          }
        }}
        onDidEndDrag={() => {
          if (this.state.playbackStateOnDragStart === 'playing') {
            onRequestPlay();
            this.setState({
              playbackStateOnDragStart: null,
            });
          }
        }}
      >
        {assetID && (
          <SeekbarBackground assetID={assetID} style={styles.seekbarBackground} />
        )}
      </Slider>
    );
  }
}
