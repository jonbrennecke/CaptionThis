// @flow
import React from 'react';
import { TouchableOpacity } from 'react-native';

import VideoPauseIcon from './VideoPauseIcon';
import VideoPlayIcon from './VideoPlayIcon';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  isPlaying: boolean,
  onPress: () => void,
};

const styles = {
  container: {},
  flex: {
    padding: 12,
    flex: 1,
  },
};

export default function VideoPlayPauseButton({
  style,
  isPlaying,
  onPress,
}: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      {isPlaying ? (
        <VideoPauseIcon style={styles.flex} />
      ) : (
        <VideoPlayIcon style={styles.flex} />
      )}
    </TouchableOpacity>
  );
}
