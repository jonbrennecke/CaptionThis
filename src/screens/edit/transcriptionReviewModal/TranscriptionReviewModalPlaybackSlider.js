// @flow
import React from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';

import { Slider } from '../../../components';
import { Colors, Units } from '../../../constants';
import * as Fonts from '../../../utils/Fonts';

import type { SFC, Style } from '../../../types';

export type TranscriptionReviewModalPlaybackSliderProps = {
  style?: ?Style,
  value: number,
  min: number,
  max: number,
  onSelectValue: number => void,
};

const CONTAINER_HEIGHT = 50;
const HANDLE_RADIUS = 7;
const SLIDER_HEIGHT = 5;

const styles = {
  container: {
    height: CONTAINER_HEIGHT * 0.5,
  },
  sliderContainer: {
    height: CONTAINER_HEIGHT,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -CONTAINER_HEIGHT * 0.5,
  },
  absoluteFill: StyleSheet.absoluteFill,
  handle: {
    height: HANDLE_RADIUS * 2,
    width: HANDLE_RADIUS * 2,
    borderRadius: HANDLE_RADIUS,
    backgroundColor: Colors.solid.nimbus,
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
    backgroundColor: Colors.solid.lightGray,
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
    backgroundColor: Colors.solid.nimbus,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Units.medium,
  },
  durationText: {
    ...Fonts.getFontStyle('default', { contentStyle: 'darkContent' }),
    color: Colors.solid.darkGray,
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
    <View style={styles.infoContainer}>
      <Text style={styles.durationText}>{formatTime(value)}</Text>
      <Text style={styles.durationText}>{formatTime(max - value)}</Text>
    </View>
    <View style={styles.sliderContainer}>
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
        onDidBeginDrag={() => {
          hapticFeedback();
          // TODO
          // this.setState({
          //   playbackStateOnDragStart: playbackState,
          // });
          // if (playbackState === 'playing') {
          //   onRequestPause();
          // }
        }}
        onDidEndDrag={p => {
          hapticFeedback();
          onSelectValue(p * (max - min) + min);
        }}
      />
    </View>
  </View>
);

function formatTime(time: number): string {
  const minutes = parseInt(time / 60).toFixed(0);
  const seconds = parseInt(time % 60)
    .toFixed(0)
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}
