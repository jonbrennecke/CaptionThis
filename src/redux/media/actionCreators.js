// @flow
import * as Debug from '../../utils/Debug';
import { ACTION_TYPES } from './constants';
import * as Camera from '../../utils/Camera';
import * as VideoExportManager from '../../utils/VideoExportManager';

import type {
  Dispatch,
  ReceiveVideoAssetsPayload,
  ReceiveVideoAssetPayload,
} from '../../types/redux';
import type { VideoAssetIdentifier, VideoObject } from '../../types/media';
import type { ExportParams } from '../../utils/VideoExportManager';

export const receiveVideos = (videos: VideoObject[]) => {
  return async (dispatch: Dispatch<ReceiveVideoAssetsPayload>) => {
    dispatch({ type: ACTION_TYPES.WILL_RECEIVE_VIDEOS });
    try {
      dispatch({
        type: ACTION_TYPES.DID_RECEIVE_VIDEOS,
        payload: {
          videos,
        },
      });
    } catch (error) {
      await Debug.logError(error);
      dispatch({ type: ACTION_TYPES.DID_FAIL_TO_RECEIVE_VIDEOS });
    }
  };
};

export const receiveFinishedVideo = (
  videoAssetIdentifier: VideoAssetIdentifier
) => {
  return (dispatch: Dispatch<ReceiveVideoAssetPayload>) => {
    dispatch({
      type: ACTION_TYPES.DID_RECEIVE_FINISHED_VIDEO,
      payload: { videoAssetIdentifier },
    });
  };
};

export const beginCameraCapture = () => {
  return async (dispatch: Dispatch<*>) => {
    dispatch({ type: ACTION_TYPES.DID_START_CAMERA_CAPTURE });
    try {
      const success = await Camera.startCapture();
      if (!success) {
        dispatch({
          type: ACTION_TYPES.DID_UNSUCCESSFULLY_START_CAMERA_CAPTURE,
        });
        return;
      }
      dispatch({
        type: ACTION_TYPES.DID_SUCCESSFULLY_START_CAMERA_CAPTURE,
      });
    } catch (error) {
      await Debug.logError(error);
      dispatch({
        type: ACTION_TYPES.DID_UNSUCCESSFULLY_START_CAMERA_CAPTURE,
      });
    }
  };
};

export const endCameraCapture = () => {
  return async (dispatch: Dispatch<*>) => {
    dispatch({ type: ACTION_TYPES.DID_STOP_CAMERA_CAPTURE });
    try {
      Camera.stopCapture();
      dispatch({
        type: ACTION_TYPES.DID_SUCCESSFULLY_STOP_CAMERA_CAPTURE,
      });
    } catch (error) {
      await Debug.logError(error);
      dispatch({
        type: ACTION_TYPES.DID_UNSUCCESSFULLY_STOP_CAMERA_CAPTURE,
      });
    }
  };
};

export const exportVideo = (exportParams: ExportParams) => {
  return async (dispatch: Dispatch<*>) => {
    dispatch({ type: ACTION_TYPES.WILL_EXPORT_VIDEO });
    try {
      await VideoExportManager.exportVideo(exportParams);
      dispatch({
        type: ACTION_TYPES.DID_SUCCESSFULLY_EXPORT_VIDEO,
      });
    } catch (error) {
      await Debug.logError(error);
      dispatch({
        type: ACTION_TYPES.DID_NOT_SUCCESSFULLY_EXPORT_VIDEO,
      });
    }
  };
};
