// @flow
import { handleActions } from 'redux-actions';
import { ACTION_TYPES } from './constants';
import { LOADING_STATE } from '../../constants';

import type {
  Action,
  MediaState,
  ReceiveVideoAssetsPayload,
  ReceiveVideoAssetPayload,
} from '../../types/redux';

const initialState: MediaState = {
  cameraRecordingState: {
    isRecording: false,
    videoAssetIdentifier: null,
  },
  videos: [],
  mediaLoadingState: LOADING_STATE.NOT_LOADED,
  videoExportState: LOADING_STATE.NOT_LOADED,
};

const actions = {
  [ACTION_TYPES.WILL_RECEIVE_VIDEOS]: willLoadVideos,
  [ACTION_TYPES.DID_RECEIVE_VIDEOS]: didLoadVideos,
  [ACTION_TYPES.DID_FAIL_TO_RECEIVE_VIDEOS]: didFailToLoadVideos,
  [ACTION_TYPES.DID_SUCCESSFULLY_START_CAMERA_CAPTURE]: didSuccessfullyStartCameraCapture,
  [ACTION_TYPES.DID_SUCCESSFULLY_STOP_CAMERA_CAPTURE]: didSuccessfullyStopCameraCapture,
  [ACTION_TYPES.DID_RECEIVE_FINISHED_VIDEO]: didReceiveFinishedVideo,
  [ACTION_TYPES.WILL_EXPORT_VIDEO]: willExportVideo,
  [ACTION_TYPES.DID_SUCCESSFULLY_EXPORT_VIDEO]: didSuccessfullyExportVideo,
  [ACTION_TYPES.DID_NOT_SUCCESSFULLY_EXPORT_VIDEO]: didNotSuccessfullyExportVideo,
};

function willLoadVideos(state: MediaState): MediaState {
  return {
    ...state,
    mediaLoadingState: LOADING_STATE.IS_LOADING,
  };
}

function didLoadVideos(
  state: MediaState,
  { payload }: Action<ReceiveVideoAssetsPayload>
): MediaState {
  if (!payload) {
    return state;
  }
  return {
    ...state,
    videos: payload.videos,
    mediaLoadingState: LOADING_STATE.WAS_LOADED_SUCCESSFULLY,
  };
}

function didFailToLoadVideos(state: MediaState): MediaState {
  return {
    ...state,
    mediaLoadingState: LOADING_STATE.WAS_LOADED_UNSUCCESSFULLY,
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
