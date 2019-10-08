// @flow
import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import { PanGestureHandler } from '../gesture-handlers';

import type { SFC, Style } from '../../types';

export type FloatingVideoPlayerProps = {
  style?: ?Style,
};

const styles = {
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  panContainer: StyleSheet.absoluteFill,
  videoPlayerContainer: {
    position: 'absolute',
    backgroundColor: 'red',
    height: 100,
    width: 50,
  },
};

export const FloatingVideoPlayer: SFC<FloatingVideoPlayerProps> = ({
  style,
}: FloatingVideoPlayerProps) => (
  <View style={[styles.container, style]}>
    <PanGestureHandler
      style={styles.panContainer}
      returnToOriginalPosition={false}
      clampToBounds
      renderChildren={props => (
        <Animated.View
          {...props}
          style={[styles.videoPlayerContainer, style, props.style]}
        />
      )}
    />
  </View>
);
