// @flow
import React from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';

import { Slider } from '../../../components';

import type { SFC, Style } from '../../../types';

export type TranscriptionReviewModalPlaybackSliderProps = {
  style?: ?Style,
  value: number,
  min: number,
  max: number,
  onSelectValue: number => void,
};

const CONTAINER_HEIGHT = 50;
const HANDLE_RADIUS = 10;
const SLIDER_HEIGHT = 7;

const styles = {
  container: {
    height: 50,
    backgroundColor: 'pink',
  },
  absoluteFill: StyleSheet.absoluteFill,
  handle: {
    height: HANDLE_RADIUS * 2,
    width: HANDLE_RADIUS * 2,
    borderRadius: HANDLE_RADIUS,
    backgroundColor: 'red',
    top: CONTAINER_HEIGHT * 0.5 - HANDLE_RADIUS,
    left: -HANDLE_RADIUS,
  },
  handleContainer: {
    height: HANDLE_RADIUS * 2,
    width: HANDLE_RADIUS * 2,
  },
  background: {
    position: 'absolute',
    width: '100%',
    top: (CONTAINER_HEIGHT - SLIDER_HEIGHT) / 2,
    height: SLIDER_HEIGHT,
    overflow: 'hidden',
    backgroundColor: 'red',
  },
  maskedBarBackground: {
    position: 'absolute',
    top: CONTAINER_HEIGHT * 0.5 - SLIDER_HEIGHT / 2,
    bottom: 0,
    left: 0,
    width: 1000,
    height: SLIDER_HEIGHT,
    transform: [
      {
        translateX: -1000,
      },
    ],
    backgroundColor: 'blue',
  },
};

function hapticFeedback() {
  ReactNativeHaptic.generate('selection');
}

// eslint-disable-next-line flowtype/generic-spacing
export const TranscriptionReviewModalPlaybackSlider: SFC<
  TranscriptionReviewModalPlaybackSliderProps
> = ({
  style,
  value,
  min,
  max,
  onSelectValue,
}: TranscriptionReviewModalPlaybackSliderProps) => (
  <View style={[styles.container, style]}>
    <View style={styles.background} pointerEvents="none" />
    <Slider
      style={styles.absoluteFill}
      progress={(value - min) / (max - min)}
      initialProgress={(value - min) / (max - min)}
      renderHandle={props => (
        <>
          <Animated.View
            {...props}
            style={[props.style, styles.handleContainer]}
            pointerEvents="none"
          >
            <View style={styles.maskedBarBackground} />
            <View style={styles.handle} />
          </Animated.View>
        </>
      )}
      onSeekToProgress={p => onSelectValue(p * (max - min) + min)}
      onDidBeginDrag={hapticFeedback}
      onDidEndDrag={p => {
        hapticFeedback();
        onSelectValue(p * (max - min) + min);
      }}
    />
  </View>
);
