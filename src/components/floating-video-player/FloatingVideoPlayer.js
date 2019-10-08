// @flow
import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import { PanGestureHandler } from '../gesture-handlers';
import { Units, Colors } from '../../constants';

import type { SFC, Style } from '../../types';

export type FloatingVideoPlayerProps = {
  style?: ?Style,
};

const styles = {
  container: StyleSheet.absoluteFillObject,
  panContainer: {
    position: 'absolute',
    width: 100,
    height: 16 / 9 * 100,
  },
  videoPlayerContainer: {
    ...StyleSheet.absoluteFillObject,
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
  <View style={[styles.container, style]} pointerEvents="box-none">
    <PanGestureHandler
      style={styles.panContainer}
      returnToOriginalPosition={false}
      attachPanHandlersToChildren
      jumpToGrantedPosition={false}
      clampToBounds={false}
      renderChildren={props => (
        <Animated.View
          {...props}
          style={[styles.videoPlayerContainer, style, props.style]}
        />
      )}
    />
  </View>
);
