// @flow
import React, { Component } from 'react';
import { Animated } from 'react-native';

import BottomSheetAnimation from '../../animations/BottomSheetAnimation';

import type { Style, Children } from '../../types/react';

type Props = {
  style?: ?Style,
  isVisible: boolean,
  children: ?Children,
  delay?: number,
};

const styles = {
  anim: (anim: BottomSheetAnimation) => anim.getAnimatedStyle(),
};

export default class BottomSheetAnimatedView extends Component<Props> {
  anim: BottomSheetAnimation;

  constructor(props: Props) {
    super(props);
    this.anim = new BottomSheetAnimation({
      start: this.props.isVisible ? 'in' : 'out',
      delay: this.props.delay,
    });
  }

  componentDidMount() {
    if (this.props.isVisible) {
      this.anim.animateIn();
    } else if (!this.props.isVisible) {
      this.anim.animateOut();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.isVisible && !prevProps.isVisible) {
      this.anim.animateIn();
    } else if (!this.props.isVisible && prevProps.isVisible) {
      this.anim.animateOut();
    }
  }

  render() {
    return (
      <Animated.View
        style={[this.props.style, styles.anim(this.anim)]}
        pointerEvents={this.props.isVisible ? 'auto' : 'none'}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
