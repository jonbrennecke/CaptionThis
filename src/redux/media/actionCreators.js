// @flow
import * as Debug from '../../utils/Debug';
import { ACTION_TYPES } from './constants';

import type { Dispatch } from '../../types/redux';

export const receiveFinishedVideo = () => {
  return (dispatch: Dispatch<*>) => {
    dispatch({
      type: ACTION_TYPES.DID_RECEIVE_FINISHED_VIDEO,
    });
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
