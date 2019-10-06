// @flow
import React from 'react';
import { Modal, StatusBar, View } from 'react-native';
// $FlowFixMe
import { withSafeArea } from 'react-native-safe-area';

import KeyboardAvoidingView from '../../../components/keyboard-avoiding-view/KeyboardAvoidingView';
import { wrapWithTranscriptionReviewState } from './transcriptionReviewState';
import { TranscriptionTextInput } from './TranscriptionTextInput';
import { TranscriptionReviewModalPlaybackSlider } from './TranscriptionReviewModalPlaybackSlider';
import { Units } from '../../../constants';

import type { ComponentType } from 'react';

import type {
  SpeechTranscription,
  SpeechTranscriptionSegment,
} from '../../../types';

export type TranscriptionReviewModalProps = {
  isVisible: boolean,
  duration: number,
  speechTranscription: ?SpeechTranscription,
  onRequestDismiss: () => void,
};

const SafeAreaView = withSafeArea(View, 'padding', 'vertical');

const styles = {
  flex: {
    flex: 1,
  },
  transcriptionContainer: {
    flex: 1,
    paddingVertical: Units.extraLarge,
    paddingHorizontal: Units.extraLarge,
  },
  playbackControlsContainer: {},
};

// eslint-disable-next-line flowtype/generic-spacing
export const TranscriptionReviewModal: ComponentType<
  TranscriptionReviewModalProps
> = wrapWithTranscriptionReviewState(
  ({
    isVisible,
    playbackTime,
    setPlaybackTime,
    duration,
    onRequestDismiss,
    speechTranscription,
    speechTranscriptionSegmentSelection,
    setSpeechTranscriptionSegmentSelection,
    bottomSafeAreaInset,
  }) => {
    const segments = speechTranscription
      ? interpolateSegments(speechTranscription.segments)
      : null;
    return (
      <Modal visible={isVisible} onRequestDismissModal={onRequestDismiss}>
        {isVisible && <StatusBar barStyle="dark-content" />}
        <KeyboardAvoidingView
          style={styles.flex}
          keyboardVerticalOffset={-(bottomSafeAreaInset || 0) + 7}
        >
          <SafeAreaView style={styles.flex}>
            <View style={styles.playbackControlsContainer}>
              <TranscriptionReviewModalPlaybackSlider
                value={playbackTime}
                min={0}
                max={duration}
                onSelectValue={playbackTime => {
                  setPlaybackTime(playbackTime);
                  if (segments) {
                    const index = findIndexOfSegmentAtPlaybackTime(
                      segments,
                      playbackTime
                    );
                    if (index >= 0) {
                      setSpeechTranscriptionSegmentSelection({
                        startIndex: index,
                        endIndex: index,
                      });
                    }
                  }
                }}
              />
            </View>
            <View style={styles.transcriptionContainer}>
              <TranscriptionTextInput
                speechTranscriptionSegments={segments}
                speechTranscriptionSegmentSelection={
                  speechTranscriptionSegmentSelection
                }
                onSelectionChange={
                  setSpeechTranscriptionSegmentSelection
                  // TODO: set playbackTime to match first segment in selection
                }
              />
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
);

function findIndexOfSegmentAtPlaybackTime(
  segments: Array<SpeechTranscriptionSegment>,
  playbackTime: number
) {
  return segments.findIndex(s => {
    return (
      playbackTime >= s.timestamp && playbackTime <= s.timestamp + s.duration
    );
  });
}

function interpolateSegments(
  segments: Array<SpeechTranscriptionSegment>
): Array<SpeechTranscriptionSegment> {
  let outputSegments: Array<SpeechTranscriptionSegment> = [];
  segments.forEach(segment => {
    const words = segment.substring.split(/\s+/).filter(s => !!s);
    const durationPerWord = segment.duration / words.length;
    words.forEach((word, index) => {
      outputSegments.push({
        duration: durationPerWord,
        timestamp: segment.timestamp + index * durationPerWord,
        substring: word,
        confidence: segment.confidence,
        alternativeSubstrings: [],
      });
      outputSegments.push({
        duration: durationPerWord,
        timestamp: segment.timestamp + index * durationPerWord,
        substring: ' ',
        confidence: segment.confidence,
        alternativeSubstrings: [],
      });
    });
  });
  return outputSegments;
}
