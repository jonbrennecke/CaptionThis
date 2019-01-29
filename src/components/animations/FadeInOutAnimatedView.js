// @flow
import React, { Component } from 'react';
import { Animated } from 'react-native';

import FadeAnimation from '../../animations/FadeAnimation';

import type { Style, Children } from '../../types/react';

type Props = {
  style?: ?Style,
  isVisible: boolean,
  children: ?Children,
};

const styles = {
  fade: (anim: FadeAnimation) => anim.getAnimatedStyle(),
};

export default class FadeInOutAnimatedView extends Component<Props> {
  anim: FadeAnimation;

  constructor(props: Props) {
    super(props);
    this.anim = new FadeAnimation({
      start: this.props.isVisible ? 'in' : 'out',
    });
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
        style={[this.props.style, styles.fade(this.anim)]}
        pointerEvents={this.props.isVisible ? 'auto' : 'none'}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
