// @flow
import { handleActions } from 'redux-actions';
import { ACTION_TYPES } from './constants';
import { LOADING_STATE, FONT_FAMILIES } from '../../constants';

import type {
  Action,
  MediaState,
  ReceiveVideoAssetsPayload,
  ReceiveSpeechTranscriptionPayload,
  ReceiveFontFamilyPayload,
} from '../../types/redux';

const DEFAULT_FONT_FAMILY = FONT_FAMILIES.SOURCE_SANS_PRO;

const initialState: MediaState = {
  speechTranscriptions: new Map(),
  videoAssetIdentifiers: [],
  mediaLoadingState: LOADING_STATE.NOT_LOADED,
  fontFamily: DEFAULT_FONT_FAMILY,
};

const actions = {
  [ACTION_TYPES.DID_START_LOADING_VIDEO_ASSETS]: didStartLoadingVideoAssets,
  [ACTION_TYPES.DID_SUCCESSFULLY_LOAD_VIDEO_ASSETS]: didSuccessfullyLoadVideoAssets,
  [ACTION_TYPES.DID_UNSUCCESSFULLY_LOAD_VIDEO_ASSETS]: didUnsuccessfullyLoadVideoAssets,
  [ACTION_TYPES.DID_SUCCESSFULLY_RECEIVE_SPEECH_TRANSCRIPTION]: didSuccessfullyReceiveSpeechTranscription,
  [ACTION_TYPES.DID_SUCCESSFULLY_RECEIVE_FONT_FAMILY]: didSuccessfullyReceiveFontFamily,
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

function didSuccessfullyReceiveFontFamily(
  state: MediaState,
  { payload }: Action<ReceiveFontFamilyPayload>
): MediaState {
  if (!payload) {
    return state;
  }
  return {
    ...state,
    fontFamily: payload.fontFamily,
  };
}

export default handleActions(actions, initialState);
