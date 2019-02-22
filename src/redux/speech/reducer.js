// @flow
import { handleActions } from 'redux-actions';
import { ACTION_TYPES } from './constants';
import { TRANSCRIPTION_STATE } from '../../constants';

import type {
  Action,
  SpeechState,
  ReceiveSpeechTranscriptionPayload,
  ReceiveLocalePayload,
} from '../../types/redux';

const initialState: SpeechState = {
  locale: null,
  speechTranscriptions: new Map(),
  speechTranscriptionState: TRANSCRIPTION_STATE.NONE,
};

const actions = {
  [ACTION_TYPES.DID_START_SPEECH_TRANSCRIPTION]: didStartSpeechTranscription,
  [ACTION_TYPES.DID_SUCCESSFULLY_RECEIVE_SPEECH_TRANSCRIPTION]: didSuccessfullyReceiveSpeechTranscription,
  [ACTION_TYPES.DID_NOT_SUCCESSFULLY_RECEIVE_SPEECH_TRANSCRIPTION]: didNotSuccessfullyReceiveSpeechTranscription,
  [ACTION_TYPES.DID_SET_LOCALE]: didSetLocale,
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

function didSetLocale(
  state: SpeechState,
  { payload }: Action<ReceiveLocalePayload>
): SpeechState {
  if (!payload) {
    return state;
  }
  return {
    ...state,
    locale: payload.locale,
  };
}

export default handleActions(actions, initialState);
