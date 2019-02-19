// @flow
import React from 'react';
import { Animated, MaskedViewIOS, View, StyleSheet } from 'react-native';

import * as Fonts from '../../utils/Fonts';
import * as Color from '../../utils/Color';
import { UI_COLORS } from '../../constants';

import type { Element } from 'react';
import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  renderProgressElement: (props: ProgressProps) => Element<*>,
  renderTextElement: (props: ProgressProps) => Element<*>,
  radius: number,
};

type ProgressProps = {
  style: Style,
};

const styles = {
  outerView: (radius: number) => ({
    height: radius,
    width: radius,
    borderRadius: radius / 2,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  border: (radius: number) => ({
    height: radius,
    width: radius,
    borderRadius: radius / 2,
    borderWidth: 4,
    position: 'absolute',
  }),
  borderMask: (radius: number) => ({
    height: radius,
    width: radius,
    borderRadius: radius / 2,
    position: 'absolute',
  }),
  inner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    opacity: 0.25,
  },
  text: {
    ...Fonts.getFontStyle('heading', {
      contentStyle: 'lightContent',
      size: 'large',
    }),
    textShadowColor: Color.hexToRgbaString(UI_COLORS.BLACK, 0.25),
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 1,
    textAlign: 'center',
  },
  progress: (radius: number) => ({
    height: radius,
    width: radius,
    borderRadius: radius / 2,
    position: 'absolute',
  }),
};

export default function ProgressCircleContainer(props: Props) {
  return (
    <Animated.View style={[styles.outerView(props.radius), props.style]}>
      <MaskedViewIOS
        style={styles.borderMask(props.radius)}
        maskElement={<View style={styles.border(props.radius)} />}
      >
        <View style={styles.inner} />
      </MaskedViewIOS>
      {props.renderProgressElement({ style: styles.progress(props.radius) })}
      {props.renderTextElement({ style: styles.text })}
      </Animated.View>
  );
}
