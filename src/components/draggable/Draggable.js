// @flow
import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import { PanGestureHandler } from '../gesture-handlers';

import type { SFC, Style, Children } from '../../types';

export type DraggableProps = {
  style?: ?Style,
  contentContainerStyle?: ?Style,
  children?: ?Children,
};

const styles = {
  panContainer: {
    position: 'absolute',
  },
  absoluteFill: StyleSheet.absoluteFillObject,
};

export const Draggable: SFC<DraggableProps> = ({
  style,
  contentContainerStyle,
  children,
}: DraggableProps) => (
  <View style={[styles.absoluteFill, style]} pointerEvents="box-none">
    <PanGestureHandler
      style={styles.panContainer}
      returnToOriginalPosition={false}
      attachPanHandlersToChildren
      jumpToGrantedPosition={false}
      clampToBounds={false}
      renderChildren={props => (
        <Animated.View
          {...props}
          style={[
            styles.absoluteFill,
            style,
            props.style,
            contentContainerStyle,
          ]}
        >
          {children}
        </Animated.View>
      )}
    />
  </View>
);
