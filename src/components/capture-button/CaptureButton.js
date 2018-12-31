// @flow
import React, { Component } from 'react';
import { Animated, TouchableWithoutFeedback } from 'react-native';
import { autobind } from 'core-decorators';
import { BlurView } from 'react-native-blur';

import { UI_COLORS } from '../../constants';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const styles = {
  blurView: (anim: Animated.Value) => ({
    height: 100,
    width: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: anim }],
  }),
  innerView: (anim: Animated.Value) => ({
    backgroundColor: UI_COLORS.WHITE,
    height: 57,
    width: 57,
    borderRadius: 28.5,
    transform: [{ scale: anim }],
  }),
};

// $FlowFixMe
@autobind
export default class ColorPicker extends Component<Props> {
  innerViewAnim: Animated.Value = new Animated.Value(1.0);
  blurViewAnim: Animated.Value = new Animated.Value(1.0);

  touchableOnPressIn() {
    Animated.parallel([
      Animated.spring(this.innerViewAnim, {
        toValue: 1.5,
        duration: 350,
      }),
      Animated.spring(this.blurViewAnim, {
        toValue: 1.25,
        duration: 350,
      }),
    ]).start();
  }

  touchableOnPressOut() {
    Animated.parallel([
      Animated.spring(this.innerViewAnim, {
        toValue: 1.0,
        duration: 350,
      }),
      Animated.spring(this.blurViewAnim, {
        toValue: 1.0,
        duration: 350,
      }),
    ]).start();
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPressIn={this.touchableOnPressIn}
        onPressOut={this.touchableOnPressOut}
      >
        <AnimatedBlurView
          style={[styles.blurView(this.blurViewAnim), this.props.style]}
          blurType="light"
        >
          <Animated.View style={styles.innerView(this.innerViewAnim)} />
        </AnimatedBlurView>
      </TouchableWithoutFeedback>
    );
  }
}
