// @flow
import React from 'react';
import { Modal, StatusBar, View } from 'react-native';
// $FlowFixMe
import { withSafeArea } from 'react-native-safe-area';

import KeyboardAvoidingView from '../../../components/keyboard-avoiding-view/KeyboardAvoidingView';
import { wrapWithTranscriptionReviewState } from './transcriptionReviewState';
import { TranscriptionTextInput } from './TranscriptionTextInput';
import { Units } from '../../../constants';

import type { ComponentType } from 'react';

import type { SpeechTranscription } from '../../../types';

export type TranscriptionReviewModalProps = {
  isVisible: boolean,
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
};

// eslint-disable-next-line flowtype/generic-spacing
export const TranscriptionReviewModal: ComponentType<
  TranscriptionReviewModalProps
> = wrapWithTranscriptionReviewState(
  ({
    isVisible,
    onRequestDismiss,
    speechTranscription,
    speechTranscriptionSegmentSelection,
    setSpeechTranscriptionSegmentSelection,
    bottomSafeAreaInset,
  }) => (
    <Modal visible={isVisible} onRequestDismissModal={onRequestDismiss}>
      {isVisible && <StatusBar barStyle="dark-content" />}
      <KeyboardAvoidingView
        style={styles.flex}
        keyboardVerticalOffset={-(bottomSafeAreaInset || 0) + 7}
      >
        <SafeAreaView style={styles.flex}>
          <View style={styles.transcriptionContainer}>
            <TranscriptionTextInput
              speechTranscriptionSegments={speechTranscription?.segments}
              speechTranscriptionSegmentSelection={
                speechTranscriptionSegmentSelection
              }
              onSelectionChange={setSpeechTranscriptionSegmentSelection}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  )
);
