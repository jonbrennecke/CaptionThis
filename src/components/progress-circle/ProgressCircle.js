// @flow
import React from 'react';
import { Animated } from 'react-native';
// eslint-disable-next-line import/no-named-as-default
import Svg, { Circle } from 'react-native-svg';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  progress: Animated.Value,
  fillColor: string,
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = {
  container: {},
};

export default function ProgressCircle(props: Props) {
  const size = 100;
  const halfSize = 100 / 2;
  const strokeWidth = 2.25;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = props.progress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });
  return (
    <Svg style={[styles.container, props.style]} viewBox="0 0 100 100">
      <AnimatedCircle
        cx={halfSize}
        cy={halfSize}
        originX={halfSize}
        originY={halfSize}
        rotation={-90}
        r={radius}
        stroke={props.fillColor}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={[circumference]}
        strokeDashoffset={progress}
        strokeLinecap="butt"
      />
    </Svg>
  );
}
