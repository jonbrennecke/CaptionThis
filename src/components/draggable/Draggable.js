// @flow
import React, { PureComponent, createRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import noop from 'lodash/noop';

import { PanGestureHandler } from '../gesture-handlers';

import type { Style, Children } from '../../types';

export type DraggableProps = {
  style?: ?Style,
  children?: ?Children,
  disabled?: boolean,
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

export class Draggable extends PureComponent<DraggableProps> {
  panGestureHandlerRef = createRef();

  returnToInitialPosition() {
    if (this.panGestureHandlerRef.current && this.props.initialPosition) {
      this.panGestureHandlerRef.current.setPanValueAnimated(
        this.props.initialPosition
      );
    }
  }

  render() {
    const {
      style,
      contentContainerStyle,
      children,
      disabled = false,
      initialPosition,
      onDragStart = noop,
      onDragEnd = noop,
    } = this.props;
    return (
      <View style={[styles.absoluteFill, style]} pointerEvents="box-none">
        <PanGestureHandler
          style={styles.panContainer}
          ref={this.panGestureHandlerRef}
          disabled={disabled}
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
  }
}
