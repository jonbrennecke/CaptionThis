// @flow
import React, { PureComponent } from 'react';
import { Animated } from 'react-native';

import TranslateVerticallyAnimation from '../../animations/TranslateVerticallyAnimation';

import type { Style, Children } from '../../types/react';

type Props = {
  style?: ?Style,
  isVisible: boolean,
  children: ?Children,
  delay?: number,
};

const styles = {
  view: (anim: TranslateVerticallyAnimation) => anim.getAnimatedStyle(),
};

export default class SlideUpAnimatedView extends PureComponent<Props> {
  anim: TranslateVerticallyAnimation;

  constructor(props: Props) {
    super(props);
    this.anim = new TranslateVerticallyAnimation({
      start: props.isVisible ? 'in' : 'out',
      delay: props.delay,
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
        style={[this.props.style, styles.view(this.anim)]}
        pointerEvents={this.props.isVisible ? 'auto' : 'none'}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
