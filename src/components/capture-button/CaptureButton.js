// @flow
import React, { Component } from 'react';
import { View, Animated, TouchableWithoutFeedback, MaskedViewIOS } from 'react-native';
import { autobind } from 'core-decorators';
import { BlurView } from 'react-native-blur';
import LinearGradient from 'react-native-linear-gradient';

import { UI_COLORS } from '../../constants';
import * as Color from '../../utils/Color';

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
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  borderMask: {
    height: 75,
    width: 75,
    borderRadius: 37.5,
    position: 'absolute',
  },
  linearGradientInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Color.hexToRgbaString('white', 0.1),
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
            <LinearGradient
              pointerEvents="none"
              useAngle
              angle={-45}
              angleCenter={{ x: 0.5, y: 0.5 }}
              colors={[
                Color.hexToRgbaString(UI_COLORS.LIGHT_GREEN, 0.25),
                Color.hexToRgbaString(UI_COLORS.MEDIUM_GREEN, 0.25),
              ]}
              style={styles.gradient}
            />
          </View>
          <MaskedViewIOS
            style={styles.borderMask}
            maskElement={<View style={styles.border} />}
          >
            <LinearGradient
              pointerEvents="none"
              useAngle
              angle={-45}
              angleCenter={{ x: 0.5, y: 0.5 }}
              colors={[
                UI_COLORS.LIGHT_GREEN,
                UI_COLORS.MEDIUM_GREEN
              ]}
              style={styles.gradient}
            >
              <View style={styles.linearGradientInner}/>
            </LinearGradient>
          </MaskedViewIOS>
          
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}
