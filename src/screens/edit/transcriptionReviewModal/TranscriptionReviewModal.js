// @flow
import React from 'react';
import { Modal } from 'react-native';

import { wrapWithTranscriptionReviewState } from './transcriptionReviewState';

import type { ComponentType } from 'react';

export type TranscriptionReviewModalProps = {
  isVisible: boolean,
  onRequestDismiss: () => void,
};

// eslint-disable-next-line flowtype/generic-spacing
export const TranscriptionReviewModal: ComponentType<
  TranscriptionReviewModalProps
> = wrapWithTranscriptionReviewState(
  ({ isVisible, onRequestDismiss }: TranscriptionReviewModalProps) => (
    <Modal visible={isVisible} onRequestDismissModal={onRequestDismiss} />
  )
);
