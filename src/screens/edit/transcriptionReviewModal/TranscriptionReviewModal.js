// @flow
import React from 'react';
import { Modal, StatusBar, View } from 'react-native';
// $FlowFixMe
import { withSafeArea } from 'react-native-safe-area';

import KeyboardAvoidingView from '../../../components/keyboard-avoiding-view/KeyboardAvoidingView';
import { wrapWithTranscriptionReviewState } from './transcriptionReviewState';
import { TranscriptionTextInput } from './TranscriptionTextInput';
import { TranscriptionReviewModalPlaybackSlider } from './TranscriptionReviewModalPlaybackSlider';
import { FloatingVideoPlayer } from '../../../components';
import { Units, Colors } from '../../../constants';
import {
  interpolateSegments,
  findIndexOfSegmentAtPlaybackTime,
} from './transcriptionReviewUtils';

import type { ComponentType } from 'react';

import type { SpeechTranscription } from '../../../types';

export type TranscriptionReviewModalProps = {
  isVisible: boolean,
  duration: number,
  speechTranscription: ?SpeechTranscription,
  onRequestDismiss: () => void,
  onSpeechTranscriptionChange: SpeechTranscription => void,
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
    backgroundColor: Colors.solid.extraLightGray,
    // shadowColor: Colors.solid.darkGray,
    // shadowOpacity: 1,
    // shadowRadius: 25,
    // shadowOffset: {
    //   width: 0,
    //   height: 10,
    // },
  },
  playbackControlsContainer: {
    zIndex: 1000,
  },
  navigationControlsContainer: {},
  playbackControls: {},
  floatingVideoPlayer: {
    zIndex: 1000,
  }
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
    onSpeechTranscriptionChange,
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
            <View style={styles.navigationControlsContainer}>
              {/* Back button */}
            </View>
            <View style={styles.playbackControlsContainer}>
              <View style={styles.playbackControls}>{/* Play button */}</View>
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
                onSpeechTranscriptionSegmentsChange={segments => {
                  if (!segments || !speechTranscription) {
                    return;
                  }
                  onSpeechTranscriptionChange({
                    ...speechTranscription,
                    segments,
                  });
                }}
              />
              <FloatingVideoPlayer style={styles.floatingVideoPlayer} />
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
);
