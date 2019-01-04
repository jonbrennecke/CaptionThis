// @flow
import React, { Component } from 'react';
import { Text, SafeAreaView, Animated } from 'react-native';
import { BlurView } from 'react-native-blur';

import * as Fonts from '../../utils/Fonts';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  isVisible: boolean,
};

const styles = {
  container: (anim: Animated.Value) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: anim,
  }),
  flexCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: Fonts.getFontStyle('title', { contentStyle: 'lightContent' }),
};

export default class EditScreenExportingOverlay extends Component<Props> {
  anim: Animated.Value = new Animated.Value(0);

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
    Animated.timing(this.anim, {
      toValue: 1,
      duration: 300,
    }).start();
  }

  animateOut() {
    Animated.timing(this.anim, {
      toValue: 0,
      duration: 300,
    }).start();
  }

  render() {
    return (
      <Animated.View
        style={[styles.container(this.anim), this.props.style]}
        pointerEvents="none"
      >
        <BlurView style={styles.blurView} blurType="dark" />
        <SafeAreaView style={styles.flexCenter}>
          <Text style={styles.title}>Loading...</Text>
        </SafeAreaView>
      </Animated.View>
    );
  }
}
