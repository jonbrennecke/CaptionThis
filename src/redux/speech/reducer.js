// @flow
import { handleActions } from 'redux-actions';
import { ACTION_TYPES } from './constants';
import { TRANSCRIPTION_STATE } from '../../constants';

import type {
  Action,
  SpeechState,
  ReceiveSpeechTranscriptionPayload,
} from '../../types/redux';

const initialState: SpeechState = {
  speechTranscriptions: new Map(),
  speechTranscriptionState: TRANSCRIPTION_STATE.NONE,
};

const actions = {
  [ACTION_TYPES.DID_START_SPEECH_TRANSCRIPTION]: didStartSpeechTranscription,
  [ACTION_TYPES.DID_SUCCESSFULLY_RECEIVE_SPEECH_TRANSCRIPTION]: didSuccessfullyReceiveSpeechTranscription,
  [ACTION_TYPES.DID_NOT_SUCCESSFULLY_RECEIVE_SPEECH_TRANSCRIPTION]: didNotSuccessfullyReceiveSpeechTranscription,
};

function didStartSpeechTranscription(state: SpeechState): SpeechState {
  return {
    ...state,
    speechTranscriptionState: TRANSCRIPTION_STATE.IN_PROGRESS,
  };
}

function didSuccessfullyReceiveSpeechTranscription(
  state: SpeechState,
  { payload }: Action<ReceiveSpeechTranscriptionPayload>
): SpeechState {
  if (!payload) {
    return state;
  }
  const speechTranscriptions = new Map(state.speechTranscriptions);
  speechTranscriptions.set(payload.videoAssetIdentifier, payload.transcription);
  return {
    ...state,
    speechTranscriptions,
    speechTranscriptionState: TRANSCRIPTION_STATE.IN_PROGRESS,
  };
}

function didNotSuccessfullyReceiveSpeechTranscription(
  state: SpeechState
): SpeechState {
  return {
    ...state,
    speechTranscriptionState: TRANSCRIPTION_STATE.FAILED,
  };
}

export default handleActions(actions, initialState);
