// @flow
import React, { Component } from 'react';
import { Animated, Easing, View, TouchableOpacity } from 'react-native';
import { autobind } from 'core-decorators';

import { UI_COLORS } from '../../constants';

import type { Style, Children } from '../../types/react';

type Props = {
  style?: ?Style,
  size: { width: number, height: number },
  isSelected: boolean,
  children: ?Children,
  onPress: () => void,
  onAnimationInDidEnd?: () => void,
  onAnimationOutDidEnd?: () => void,
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const styles = {
  captionPresetWrap: (
    size: { width: number, height: number },
    anim: Animated.Value
  ) => ({
    height: size.height,
    width: size.width,
    marginRight: 10,
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.25],
        }),
      },
    ],
  }),
  border: (size: { width: number, height: number }, anim: Animated.Value) => ({
    opacity: anim,
    borderWidth: 1.5,
    borderColor: UI_COLORS.WHITE,
    overflow: 'hidden',
    borderRadius: 6,
    position: 'absolute',
    height: size.height,
    width: size.width,
    shadowOffset: {
      width: 0,
      height: 0.2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowColor: UI_COLORS.BLACK,
  }),
  borderInner: {
    borderRadius: 6,
    padding: 5,
    backgroundColor: UI_COLORS.MEDIUM_GREY,
    flex: 1,
  },
};

// $FlowFixMe
@autobind
export default class CaptionPresetAnimatedBorderView extends Component<Props> {
  anim = new Animated.Value(0);

  componentDidMount() {
    if (this.props.isSelected) {
      this.animateIn(this.props.onAnimationInDidEnd);
    } else if (!this.props.isSelected) {
      this.animateOut(this.props.onAnimationOutDidEnd);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.isSelected && !prevProps.isSelected) {
      this.animateIn(this.props.onAnimationInDidEnd);
    } else if (!this.props.isSelected && prevProps.isSelected) {
      this.animateOut(this.props.onAnimationOutDidEnd);
    }
  }

  animateIn(completionHandler?: () => void) {
    Animated.timing(this.anim, {
      toValue: 1,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(completionHandler);
  }

  animateOut(completionHandler?: () => void) {
    Animated.timing(this.anim, {
      toValue: 0,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(completionHandler);
  }

  render() {
    return (
      <AnimatedTouchableOpacity
        style={styles.captionPresetWrap(this.props.size, this.anim)}
        onPress={this.props.onPress}
      >
        <View style={styles.borderInner}>{this.props.children}</View>
        <Animated.View style={styles.border(this.props.size, this.anim)} />
      </AnimatedTouchableOpacity>
    );
  }
}
