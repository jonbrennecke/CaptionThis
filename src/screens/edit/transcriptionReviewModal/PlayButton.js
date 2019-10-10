// @flow
import React from 'react';
import { TouchableOpacity } from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';

import { PlayIcon, PauseIcon } from '../../../components/icons';
import { Units, Colors } from '../../../constants';

import type { PlaybackState } from '@jonbrennecke/react-native-camera';

import type { SFC, Style } from '../../../types';

export type PlayButtonProps = {
  style?: ?Style,
  disabled?: boolean,
  playbackState: PlaybackState,
  color: $Values<typeof Colors.solid>,
  onPressPlay: () => void,
  onPressPause: () => void,
};

const styles = {
  icon: {
    height: Units.extraLarge,
    width: Units.extraLarge,
  },
  button: (backgroundColor: $Values<typeof Colors.solid>) => ({
    paddingVertical: Units.extraSmall,
    paddingHorizontal: Units.medium,
    backgroundColor,
    borderRadius: Units.extraSmall,
    shadowColor: Colors.solid.darkGray,
    shadowOpacity: 0.35,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  }),
};

function hapticFeedback() {
  ReactNativeHaptic.generate('selection');
}

export const PlayButton: SFC<PlayButtonProps> = ({
  style,
  disabled = false,
  playbackState,
  onPressPlay,
  onPressPause,
  color,
}: PlayButtonProps) => (
  <TouchableOpacity
    disabled={disabled}
    style={[styles.button(color), style]}
    onPress={() => {
      hapticFeedback();
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
