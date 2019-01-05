// @flow
import { handleActions } from 'redux-actions';
import { ACTION_TYPES } from './constants';
import {
  LOADING_STATE,
  FONT_FAMILIES,
  UI_COLORS,
  TEXT_COLORS,
} from '../../constants';
import * as Color from '../../utils/Color';

import type {
  Action,
  MediaState,
  ReceiveVideoAssetsPayload,
  ReceiveSpeechTranscriptionPayload,
  ReceiveFontFamilyPayload,
  ReceiveBackgroundColorPayload,
  ReceiveTextColorPayload,
  ReceiveVideoAssetPayload,
} from '../../types/redux';

const DEFAULT_FONT_FAMILY = FONT_FAMILIES.RUBIK;
const DEFAULT_BACKGROUND_COLOR = UI_COLORS.WHITE;
const DEFAULT_TEXT_COLOR = TEXT_COLORS.DARK_GREY;

const initialState: MediaState = {
  cameraRecordingState: {
    isRecording: false,
    videoAssetIdentifier: null,
  },
  speechTranscriptions: new Map(),
  videoAssetIdentifiers: [],
  mediaLoadingState: LOADING_STATE.NOT_LOADED,
  videoExportState: LOADING_STATE.NOT_LOADED,
  fontFamily: DEFAULT_FONT_FAMILY,
  backgroundColor: Color.hexToRgbaObject(DEFAULT_BACKGROUND_COLOR),
  textColor: Color.hexToRgbaObject(DEFAULT_TEXT_COLOR),
};

const actions = {
  [ACTION_TYPES.DID_START_LOADING_VIDEO_ASSETS]: didStartLoadingVideoAssets,
  [ACTION_TYPES.DID_SUCCESSFULLY_LOAD_VIDEO_ASSETS]: didSuccessfullyLoadVideoAssets,
  [ACTION_TYPES.DID_UNSUCCESSFULLY_LOAD_VIDEO_ASSETS]: didUnsuccessfullyLoadVideoAssets,
  [ACTION_TYPES.DID_SUCCESSFULLY_RECEIVE_SPEECH_TRANSCRIPTION]: didSuccessfullyReceiveSpeechTranscription,
  [ACTION_TYPES.DID_SUCCESSFULLY_RECEIVE_FONT_FAMILY]: didSuccessfullyReceiveFontFamily,
  [ACTION_TYPES.DID_SUCCESSFULLY_RECEIVE_BACKGROUND_COLOR]: didSuccessfullyReceiveBackgroundColor,
  [ACTION_TYPES.DID_SUCCESSFULLY_RECEIVE_TEXT_COLOR]: didSuccessfullyReceiveTextColor,
  [ACTION_TYPES.DID_SUCCESSFULLY_START_CAMERA_CAPTURE]: didSuccessfullyStartCameraCapture,
  [ACTION_TYPES.DID_SUCCESSFULLY_STOP_CAMERA_CAPTURE]: didSuccessfullyStopCameraCapture,
  [ACTION_TYPES.DID_RECEIVE_FINISHED_VIDEO]: didReceiveFinishedVideo,
  [ACTION_TYPES.WILL_EXPORT_VIDEO]: willExportVideo,
  [ACTION_TYPES.DID_SUCCESSFULLY_EXPORT_VIDEO]: didSuccessfullyExportVideo,
  [ACTION_TYPES.DID_NOT_SUCCESSFULLY_EXPORT_VIDEO]: didNotSuccessfullyExportVideo,
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

function didSuccessfullyReceiveBackgroundColor(
  state: MediaState,
  { payload }: Action<ReceiveBackgroundColorPayload>
): MediaState {
  if (!payload) {
    return state;
  }
  return {
    ...state,
    backgroundColor: payload.backgroundColor,
  };
}

function didSuccessfullyReceiveTextColor(
  state: MediaState,
  { payload }: Action<ReceiveTextColorPayload>
): MediaState {
  if (!payload) {
    return state;
  }
  return {
    ...state,
    textColor: payload.textColor,
  };
}

function didSuccessfullyStartCameraCapture(state: MediaState): MediaState {
  return {
    ...state,
    cameraRecordingState: {
      isRecording: true,
      videoAssetIdentifier: null,
    },
  };
}

function didSuccessfullyStopCameraCapture(state: MediaState): MediaState {
  return {
    ...state,
    cameraRecordingState: {
      isRecording: false,
      videoAssetIdentifier: null,
    },
  };
}

function didReceiveFinishedVideo(
  state: MediaState,
  { payload }: Action<ReceiveVideoAssetPayload>
): MediaState {
  if (!payload) {
    return state;
  }
  return {
    ...state,
    cameraRecordingState: {
      isRecording: false,
      videoAssetIdentifier: payload.videoAssetIdentifier,
    },
  };
}

function willExportVideo(state: MediaState) {
  return {
    ...state,
    videoExportState: LOADING_STATE.IS_LOADING,
  };
}

function didSuccessfullyExportVideo(state: MediaState) {
  return {
    ...state,
    videoExportState: LOADING_STATE.WAS_LOADED_SUCCESSFULLY,
  };
}

function didNotSuccessfullyExportVideo(state: MediaState) {
  return {
    ...state,
    videoExportState: LOADING_STATE.WAS_LOADED_UNSUCCESSFULLY,
  };
}

export default handleActions(actions, initialState);
