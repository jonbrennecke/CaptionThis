// @flow
import React from 'react';
import { Modal, StatusBar, View } from 'react-native';
// $FlowFixMe
import { withSafeArea } from 'react-native-safe-area';

import KeyboardAvoidingView from '../../../components/keyboard-avoiding-view/KeyboardAvoidingView';
import { wrapWithTranscriptionReviewState } from './transcriptionReviewState';
import { TranscriptionTextInput } from './TranscriptionTextInput';

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
};

// eslint-disable-next-line flowtype/generic-spacing
export const TranscriptionReviewModal: ComponentType<
  TranscriptionReviewModalProps
> = wrapWithTranscriptionReviewState(
  ({
    isVisible,
    onRequestDismiss,
    speechTranscription,
    bottomSafeAreaInset,
  }) => (
    <Modal visible={isVisible} onRequestDismissModal={onRequestDismiss}>
      {isVisible && <StatusBar barStyle="dark-content" />}
      <KeyboardAvoidingView
        style={styles.flex}
        keyboardVerticalOffset={-(bottomSafeAreaInset || 0) + 7}
      >
        <SafeAreaView style={styles.flex}>
          <TranscriptionTextInput segments={speechTranscription?.segments} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  )
);
