// @flow
import { handleActions } from 'redux-actions';
import { ACTION_TYPES } from './constants';
import { LOADING_STATE } from '../../constants';

import type {
  Action,
  MediaState,
  ReceiveVideoAssetsPayload,
  ReceiveSpeechTranscriptionPayload,
} from '../../types/redux';

const initialState: MediaState = {
  speechTranscriptions: new Map(),
  videoAssetIdentifiers: [],
  mediaLoadingState: LOADING_STATE.NOT_LOADED,
};

const actions = {
  [ACTION_TYPES.DID_START_LOADING_VIDEO_ASSETS]: didStartLoadingVideoAssets,
  [ACTION_TYPES.DID_SUCCESSFULLY_LOAD_VIDEO_ASSETS]: didSuccessfullyLoadVideoAssets,
  [ACTION_TYPES.DID_UNSUCCESSFULLY_LOAD_VIDEO_ASSETS]: didUnsuccessfullyLoadVideoAssets,
  [ACTION_TYPES.DID_SUCCESSFULLY_RECEIVE_SPEECH_TRANSCRIPTION]: didSuccessfullyReceiveSpeechTranscription,
};

function didStartLoadingVideoAssets(state: MediaState): MediaState {
  return {
    ...state,
    mediaLoadingState: LOADING_STATE.IS_LOADING,
  };
}

function didSuccessfullyLoadVideoAssets(
  state: MediaState,
  { payload }: Action<ReceiveVideoAssetsPayload>
): MediaState {
  if (!payload) {
    return state;
  }
  return {
    ...state,
    videoAssetIdentifiers: payload.videoAssetIdentifiers,
    mediaLoadingState: LOADING_STATE.WAS_LOADED_SUCCESSFULLY,
  };
}

function didUnsuccessfullyLoadVideoAssets(state: MediaState): MediaState {
  return {
    ...state,
    mediaLoadingState: LOADING_STATE.WAS_LOADED_UNSUCCESSFULLY,
  };
}

function didSuccessfullyReceiveSpeechTranscription(
  state: MediaState,
  { payload }: Action<ReceiveSpeechTranscriptionPayload>
): MediaState {
  if (!payload) {
    return state;
  }
  const speechTranscriptions = new Map(state.speechTranscriptions);
  speechTranscriptions.set(payload.videoAssetIdentifier, payload.transcription);
  return {
    ...state,
    speechTranscriptions,
  };
}

export default handleActions(actions, initialState);
