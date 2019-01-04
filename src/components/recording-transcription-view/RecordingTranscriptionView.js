// @flow
import React from 'react';
import { View, requireNativeComponent } from 'react-native';

import type { Style } from '../../types/react';
import type { SpeechTranscription } from '../../types/speech';
import type { ColorRGBA } from '../../types/media';

type Props = {
  style: ?Style,
  backgroundColor: ColorRGBA,
  textColor: ColorRGBA,
  fontFamily: string,
  speechTranscription: ?SpeechTranscription,
};

const NativeTranscriptView = requireNativeComponent('TranscriptView');

const styles = {
  container: {
    height: 100,
  },
  flex: {
    flex: 1,
  },
};

export default function RecordingTranscriptionView({
  style,
  textColor,
  backgroundColor,
  fontFamily,
  speechTranscription,
}: Props) {
  const textSegments = speechTranscription
    ? speechTranscription.segments.map(segment => ({
        duration: segment.duration,
        timestamp: segment.timestamp,
        text: segment.substring,
      }))
    : [];
  return (
    <View style={[styles.container, style]}>
      <NativeTranscriptView
        style={styles.flex}
        textSegments={textSegments}
        fontFamily={fontFamily}
        textColor={[
          textColor.red / 255,
          textColor.green / 255,
          textColor.blue / 255,
          textColor.alpha,
        ]}
        backgroundColor={[
          backgroundColor.red / 255,
          backgroundColor.green / 255,
          backgroundColor.blue / 255,
          backgroundColor.alpha,
        ]}
      />
    </View>
  );
}
