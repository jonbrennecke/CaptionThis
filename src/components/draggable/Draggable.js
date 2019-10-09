// @flow
import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import noop from 'lodash/noop';

import { PanGestureHandler } from '../gesture-handlers';

import type { SFC, Style, Children } from '../../types';

export type DraggableProps = {
  style?: ?Style,
  children?: ?Children,
  contentContainerStyle?: ?Style,
  initialPosition?: { x: number, y: number },
  onDragStart?: () => void,
  onDragEnd?: () => void,
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
  initialPosition,
  onDragStart = noop,
  onDragEnd = noop,
}: DraggableProps) => (
  <View style={[styles.absoluteFill, style]} pointerEvents="box-none">
    <PanGestureHandler
      style={styles.panContainer}
      initialValue={initialPosition}
      returnToOriginalPosition={false}
      attachPanHandlersToChildren
      jumpToGrantedPosition={false}
      clampToBounds
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
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    />
  </View>
);
