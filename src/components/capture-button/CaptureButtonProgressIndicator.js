// @flow
import React from 'react';
import { Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { UI_COLORS } from '../../constants';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  progress: Animated.Value,
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = {
  container: {},
};

export default function CaptureButtonProgressIndicator(props: Props) {
  const size = 100;
  const halfSize = 100 / 2;
  const strokeWidth = 5.5;
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
        stroke={UI_COLORS.MEDIUM_GREEN}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={[circumference]}
        strokeDashoffset={progress}
        strokeLinecap="butt"
      />
    </Svg>
  );
}
