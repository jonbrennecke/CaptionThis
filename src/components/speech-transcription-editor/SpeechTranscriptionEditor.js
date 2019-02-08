// @flow
import React from 'react';
import { View, ScrollView } from 'react-native';

import SpeechTranscriptionSegmentInput from './SpeechTranscriptionSegmentInput';

import type { Style } from '../../types/react';
import type { SpeechTranscription } from '../../types/speech';

type Props = {
  style?: ?Style,
  speechTranscription: ?SpeechTranscription,
  onDidEditSpeechTranscription: SpeechTranscription => void,
};

const styles = {
  container: {},
  flex: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 25,
  },
  list: {
    paddingTop: 32,
    flexDirection: 'row',
    flexWrap: 1,
    paddingHorizontal: 34,
  },
};

export default function SpeechTranscriptionEditor({
  style,
  speechTranscription,
  onDidEditSpeechTranscription,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <ScrollView
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        overScrollMode="always"
        alwaysBounceVertical
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.list}>
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
                });
                speechTranscription.segments[index] = segment;
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
