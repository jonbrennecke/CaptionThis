// @flow
import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';

import AnimatedProgressCircle from './AnimatedProgressCircle';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  progress: number,
  fillColor: string,
};

export default class NumericProgressCircle extends Component<Props> {
  progressAnim: Animated.Value;

  constructor(props: Props) {
    super(props);
    this.progressAnim = new Animated.Value(props.progress);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.progress != this.props.progress) {
      Animated.timing(
        this.progressAnim,
        {
          toValue: this.props.progress,
          duration: 400,
          easing: Easing.linear,
          useNativeDriver: true,
        }
      ).start();
    }
  }

  render() {
    return (
      <AnimatedProgressCircle
        style={this.props.style}
        progress={this.progressAnim}
        fillColor={this.props.fillColor}
      />
    );
  }
}
