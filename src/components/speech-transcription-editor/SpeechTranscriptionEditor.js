// @flow
import React from 'react';
import { View, ScrollView } from 'react-native';

import SpeechTranscriptionSegmentInput from './SpeechTranscriptionSegmentInput';
import KeyboardAvoidingView from '../../components/keyboard-avoiding-view/KeyboardAvoidingView';

import type { Style } from '../../types/react';
import type { SpeechTranscription } from '../../types/speech';

type Props = {
  style?: ?Style,
  speechTranscription: ?SpeechTranscription,
  onDidEditSpeechTranscription: (SpeechTranscription) => void,
};

const styles = {
  container: {},
  flex: {
    flex: 1,
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
};

export default function SpeechTranscriptionEditor({
  style,
  speechTranscription,
  onDidEditSpeechTranscription,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <KeyboardAvoidingView style={styles.flex}>
        <ScrollView
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          overScrollMode="always"
          alwaysBounceVertical
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.scrollViewContent}
        >
          {(speechTranscription?.segments || []).map((segment, index) => (
            <SpeechTranscriptionSegmentInput
              key={`${segment.duration}-${index}`}
              segment={segment}
              autoFocus={index === 0}
              onEditSegment={segment => {
                if (!speechTranscription) {
                  return;
                }
                const segments = [...speechTranscription?.segments];
                segments[index] = segment;
                onDidEditSpeechTranscription({
                  ...speechTranscription,
                  segments,
                })
                speechTranscription.segments[index] = segment;
              }}
            />
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}