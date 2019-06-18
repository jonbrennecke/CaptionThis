// @flow
import { handleActions } from 'redux-actions';
import { ACTION_TYPES } from './constants';
import { LOADING_STATE } from '../../constants';

import type {
  Action,
  MediaState,
  ReceiveVideoAssetPayload,
} from '../../types/redux';

const initialState: MediaState = {
  isCameraRecording: false,
  recordedVideoID: null,
  videoExportState: LOADING_STATE.NOT_LOADED,
};

const actions = {
  [ACTION_TYPES.DID_SUCCESSFULLY_START_CAMERA_CAPTURE]: didSuccessfullyStartCameraCapture,
  [ACTION_TYPES.DID_SUCCESSFULLY_STOP_CAMERA_CAPTURE]: didSuccessfullyStopCameraCapture,
  [ACTION_TYPES.DID_RECEIVE_FINISHED_VIDEO]: didReceiveFinishedVideo,
  [ACTION_TYPES.WILL_EXPORT_VIDEO]: willExportVideo,
  [ACTION_TYPES.DID_SUCCESSFULLY_EXPORT_VIDEO]: didSuccessfullyExportVideo,
  [ACTION_TYPES.DID_NOT_SUCCESSFULLY_EXPORT_VIDEO]: didNotSuccessfullyExportVideo,
};

function didSuccessfullyStartCameraCapture(state: MediaState): MediaState {
  return {
    ...state,
    isCameraRecording: true,
    recordedVideoID: null,
  };
}

function didSuccessfullyStopCameraCapture(state: MediaState): MediaState {
  return {
    ...state,
    isCameraRecording: false,
    recordedVideoID: null,
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
    isCameraRecording: false,
    recordedVideoID: payload.video.id,
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
