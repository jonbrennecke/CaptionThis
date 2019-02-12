// @flow
import React, { Component } from 'react';
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  MaskedViewIOS,
  Easing,
} from 'react-native';
import { autobind } from 'core-decorators';
import { BlurView } from 'react-native-blur';

import { UI_COLORS } from '../../constants';
import CaptureButtonProgressIndicator from './CaptureButtonProgressIndicator';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  onRequestBeginCapture: () => void,
  onRequestEndCapture: () => void,
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const styles = {
  blurView: {
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
  },
  borderMask: {
    height: 75,
    width: 75,
    borderRadius: 37.5,
    position: 'absolute',
  },
  inner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: UI_COLORS.WHITE,
  },
  progress: {
    height: 75,
    width: 75,
    borderRadius: 37.5,
    position: 'absolute',
  },
};

// $FlowFixMe
@autobind
export default class ColorPicker extends Component<Props> {
  outerViewAnim: Animated.Value = new Animated.Value(1);
  progressAnim: Animated.Value = new Animated.Value(0);

  touchableOnPressIn() {
    Animated.parallel([
      Animated.spring(this.outerViewAnim, {
        toValue: 1.35,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(this.progressAnim, {
        toValue: 100,
        duration: 60000, // 1 minute
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
    this.props.onRequestBeginCapture();
  }

  touchableOnPressOut() {
    Animated.parallel([
      Animated.spring(this.outerViewAnim, {
        toValue: 1.0,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.spring(this.progressAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
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
          <MaskedViewIOS
            style={styles.borderMask}
            maskElement={<View style={styles.border} />}
          >
            <View style={styles.inner} />
          </MaskedViewIOS>
          <CaptureButtonProgressIndicator
            style={styles.progress}
            progress={this.progressAnim}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}
