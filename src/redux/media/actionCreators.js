// @flow
import * as Debug from '../../utils/Debug';
import { ACTION_TYPES } from './constants';
import * as Camera from '../../utils/Camera';

import type { Dispatch } from '../../types/redux';

export const receiveFinishedVideo = () => {
  return (dispatch: Dispatch<*>) => {
    dispatch({
      type: ACTION_TYPES.DID_RECEIVE_FINISHED_VIDEO,
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

export const willExportVideo = () => {
  return async (dispatch: Dispatch<*>) => {
    try {
      dispatch({
        type: ACTION_TYPES.WILL_EXPORT_VIDEO,
      });
    } catch (error) {
      await Debug.logError(error);
      dispatch({
        type: ACTION_TYPES.DID_NOT_SUCCESSFULLY_EXPORT_VIDEO,
      });
    }
  };
};

export const didExportVideo = () => {
  return async (dispatch: Dispatch<*>) => {
    try {
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
