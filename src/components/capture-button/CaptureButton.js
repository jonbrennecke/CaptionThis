// @flow
import React, { PureComponent } from 'react';
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  MaskedViewIOS,
  Easing,
} from 'react-native';
import { autobind } from 'core-decorators';
import { BlurView } from '@jonbrennecke/react-native-animated-ui';

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
export default class CaptureButton extends PureComponent<Props> {
  outerViewAnim: Animated.Value = new Animated.Value(1);

  touchableOnPressIn() {
    Animated.spring(this.outerViewAnim, {
      toValue: 1.35,
      duration: 350,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
    this.props.onRequestBeginCapture();
  }

  touchableOnPressOut() {
    Animated.spring(this.outerViewAnim, {
      toValue: 1.0,
      duration: 350,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
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
              blurType="light"
              style={[styles.blurView, this.props.style]}
            />
          </View>
          <MaskedViewIOS
            style={styles.borderMask}
            maskElement={<View style={styles.border} />}
          >
            <View style={styles.inner} />
          </MaskedViewIOS>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}
