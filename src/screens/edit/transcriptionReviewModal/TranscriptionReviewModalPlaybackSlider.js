// @flow
import React from 'react';
import { Animated, View, StyleSheet } from 'react-native';

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
  border: {
    position: 'absolute',
    width: '100%',
    top: (CONTAINER_HEIGHT - SLIDER_HEIGHT) / 2,
    height: SLIDER_HEIGHT,
    overflow: 'hidden',
    backgroundColor: 'red',
  },
};

function hapticFeedback() {
  // TODO
  // ReactNativeHaptic.generate('selection');
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
    <View style={styles.border} pointerEvents="none" />
    <Slider
      style={styles.absoluteFill}
      progress={(value - min) / (max - min)}
      initialProgress={(value - min) / (max - min)}
      renderHandle={props => (
        <Animated.View
          {...props}
          style={[props.style, styles.handle]}
          pointerEvents="none"
        />
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
