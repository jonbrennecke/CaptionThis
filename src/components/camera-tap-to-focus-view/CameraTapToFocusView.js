// @flow
import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, Animated, Easing } from 'react-native';
import { autobind } from 'core-decorators';

import { UI_COLORS } from '../../constants';

import type { Style } from '../../types/react';

type Position = { x: number, y: number };

type Props = {
  style?: ?Style,
  onDidRequestFocusOnPoint: Position => void,
};

type State = {
  touchPosition: Position,
};

const styles = {
  container: {},
  focusPoint: ({ x, y }: Position, anim: Animated.Value) => ({
    height: 100,
    width: 100,
    borderWidth: 1,
    borderColor: UI_COLORS.WHITE,
    position: 'absolute',
    top: y - 50,
    left: x - 50,
    opacity: anim,
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.25, 1],
        }),
      },
    ],
  }),
};

// $FlowFixMe
@autobind
export default class CameraTapToFocusView extends Component<Props, State> {
  state = {
    touchPosition: { x: 0, y: 0 },
  };
  anim: Animated.Value = new Animated.Value(0);

  touchableOnPressIn(event: any) {
    if (!event.nativeEvent) {
      return;
    }
    const { locationX, locationY } = event.nativeEvent;
    const touchPosition = {
      x: locationX,
      y: locationY,
    };
    this.setState({ touchPosition });
    this.animateFocusIn();
    this.props.onDidRequestFocusOnPoint(touchPosition);
  }

  touchableOnPressOut() {
    this.animateFocusOut();
  }

  animateFocusIn() {
    Animated.timing(this.anim, {
      toValue: 1,
      duration: 600,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
  }

  animateFocusOut() {
    Animated.timing(this.anim, {
      toValue: 0,
      duration: 600,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPressIn={this.touchableOnPressIn}
        onPressOut={this.touchableOnPressOut}
      >
        <View style={[styles.container, this.props.style]}>
          <Animated.View
            style={styles.focusPoint(this.state.touchPosition, this.anim)}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
