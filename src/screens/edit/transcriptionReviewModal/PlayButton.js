// @flow
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { PlayIcon, PauseIcon } from '../../../components/icons';
import { Units, Colors } from '../../../constants';

import type { PlaybackState } from '@jonbrennecke/react-native-camera';

import type { SFC, Style } from '../../../types';

export type PlayButtonProps = {
  style?: ?Style,
  disabled?: boolean,
  playbackState: PlaybackState,
  onPressPlay: () => void,
  onPressPause: () => void,
};

const styles = {
  icon: {
    height: Units.extraLarge,
    width: Units.extraLarge,
  },
  button: {
    paddingVertical: Units.extraSmall,
    paddingHorizontal: Units.medium,
    backgroundColor: Colors.solid.nimbus,
    borderRadius: Units.extraSmall,
    shadowColor: Colors.solid.darkGray,
    shadowOpacity: 0.35,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
};

export const PlayButton: SFC<PlayButtonProps> = ({
  style,
  disabled = false,
  playbackState,
  onPressPlay,
  onPressPause
}: PlayButtonProps) => (
  <TouchableOpacity
    disabled={disabled}
    style={[styles.button, style]}
    onPress={() => {
      if (playbackState !== 'playing') {
        onPressPlay();
        return;
      }
      onPressPause();
    }}
  >
    {playbackState !== 'playing' ? (
      <PlayIcon style={styles.icon} color={Colors.solid.white} />
    ) : (
      <PauseIcon style={styles.icon} color={Colors.solid.white} />
    )}
    
  </TouchableOpacity>
);
