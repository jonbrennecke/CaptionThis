// @flow
import React, { Component } from 'react';
import {
  View,
  SafeAreaView,
  Animated,
  StyleSheet,
  MaskedViewIOS,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import * as Fonts from '../../utils/Fonts';
import * as Color from '../../utils/Color';
import { UI_COLORS } from '../../constants';
import ProgressCircle from '../../components/progress-circle/ProgressCircle';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  isVisible: boolean,
  duration: number,
};

const CIRCLE_RADIUS = 175;

const styles = {
  container: (anim: Animated.Value) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: anim,
  }),
  outerView: {
    height: CIRCLE_RADIUS,
    width: CIRCLE_RADIUS,
    borderRadius: CIRCLE_RADIUS / 2,
    shadowColor: UI_COLORS.BLACK,
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    height: CIRCLE_RADIUS,
    width: CIRCLE_RADIUS,
    borderRadius: CIRCLE_RADIUS / 2,
    borderWidth: 4,
    borderColor: UI_COLORS.OFF_WHITE,
    position: 'absolute',
  },
  borderMask: {
    height: CIRCLE_RADIUS,
    width: CIRCLE_RADIUS,
    borderRadius: CIRCLE_RADIUS / 2,
    position: 'absolute',
  },
  inner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: UI_COLORS.WHITE,
  },
  progress: {
    height: CIRCLE_RADIUS,
    width: CIRCLE_RADIUS,
    borderRadius: CIRCLE_RADIUS / 2,
    position: 'absolute',
  },
  flexCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  activityIndicator: {
    marginBottom: 15,
  },
  title: Fonts.getFontStyle('title', { contentStyle: 'lightContent' }),
};

export default class EditScreenExportingOverlay extends Component<Props> {
  anim: Animated.Value = new Animated.Value(0);
  progressAnim: Animated.Value = new Animated.Value(0);

  componentDidMount() {
    if (this.props.isVisible) {
      this.animateIn();
    } else if (!this.props.isVisible) {
      this.animateOut();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.isVisible && !prevProps.isVisible) {
      this.animateIn();
    } else if (!this.props.isVisible && prevProps.isVisible) {
      this.animateOut();
    }
  }

  animateIn() {
    console.log(this.props.duration * 1000);
    Animated.parallel([
      Animated.timing(this.anim, {
        toValue: 1,
        duration: 300,
      }),
      Animated.timing(this.progressAnim, {
        toValue: 100,
        duration: this.props.duration * 1000,
        easing: Easing.linear,
      }),
    ]).start();
  }

  animateOut() {
    Animated.parallel([
      Animated.timing(this.anim, {
        toValue: 0,
        duration: 300,
      }),
      Animated.timing(this.progressAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.linear,
      }),
    ]).start();
  }

  render() {
    return (
      <Animated.View style={[styles.container(this.anim), this.props.style]}>
        <LinearGradient
          style={styles.background}
          pointerEvents="none"
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={[
            Color.hexToRgbaString('#4F5BD5', 1),
            Color.hexToRgbaString('#456FF2', 1),
          ]}
        />
        <SafeAreaView style={styles.flexCenter}>
          <Animated.View style={styles.outerView}>
            <MaskedViewIOS
              style={styles.borderMask}
              maskElement={<View style={styles.border} />}
            >
              <View style={styles.inner} />
            </MaskedViewIOS>
            <ProgressCircle
              style={styles.progress}
              progress={this.progressAnim}
              fillColor={UI_COLORS.WHITE}
            />
          </Animated.View>
        </SafeAreaView>
      </Animated.View>
    );
  }
}
