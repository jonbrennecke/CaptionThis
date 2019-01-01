// @flow
import React, { Component } from 'react';
import { View, Animated, TouchableWithoutFeedback } from 'react-native';
import { autobind } from 'core-decorators';
import { BlurView } from 'react-native-blur';

import { UI_COLORS } from '../../constants';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  onRequestBeginCapture: () => void,
  onRequestEndCapture: () => void,
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const styles = {
  blurView: {
    // height: 67,
    // width: 67,
    // borderRadius: 33.5,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, 
  },
  outerViewAnim: (anim: Animated.Value) => ({
    height: 75,
    width: 75,
    borderRadius: 37.5,
    transform: [{ scale: anim }],
    shadowColor: UI_COLORS.BLACK,
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  blurViewContainer: {
    height: 75,
    width: 75,
    borderRadius: 37.5,
    overflow: 'hidden',
  },
  border: {
    height: 75,
    width: 75,
    borderRadius: 37.5,
    borderWidth: 4,
    borderColor: UI_COLORS.OFF_WHITE,
    position: 'absolute',
  }
};

// $FlowFixMe
@autobind
export default class ColorPicker extends Component<Props> {
  outerViewAnim: Animated.Value = new Animated.Value(1.0);

  touchableOnPressIn() {
    Animated.parallel([
      Animated.spring(this.outerViewAnim, {
        toValue: 1.35,
        duration: 350,
      }),
    ]).start();
    this.props.onRequestBeginCapture();
  }

  touchableOnPressOut() {
    Animated.parallel([
      Animated.spring(this.outerViewAnim, {
        toValue: 1.0,
        duration: 350,
      }),
    ]).start();
    this.props.onRequestEndCapture();
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPressIn={this.touchableOnPressIn}
        onPressOut={this.touchableOnPressOut}
      >
        <Animated.View style={styles.outerViewAnim(this.outerViewAnim)}>
          <View style={styles.blurViewContainer}>
            <AnimatedBlurView
              style={[styles.blurView, this.props.style]}
              blurType="light"
            />
          </View>
          <View style={styles.border}/>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}
