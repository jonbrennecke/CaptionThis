// @flow
import React from 'react';
import { View } from 'react-native';

import { Draggable } from '../draggable';
import { Units, Colors } from '../../constants';

import type { SFC, Style } from '../../types';

export type FloatingVideoPlayerProps = {
  style?: ?Style,
};

const styles = {
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
}: FloatingVideoPlayerProps) => (
  <Draggable
    style={styles.draggable}
    contentContainerStyle={styles.draggableContentContainer}
  >
    <View />
  </Draggable>
);
