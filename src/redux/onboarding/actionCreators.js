// @flow
import * as actions from './actions';
import * as Debug from '../../utils/Debug';
import { ACTION_TYPES } from './constants';

import type { Dispatch } from '../../types/redux';

export const loadAppPermissions = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: ACTION_TYPES.STARTED_LOADING_APP_PERMISSIONS });
    try {
      const granted = await actions.arePermissionsGranted();
      dispatch({
        type: ACTION_TYPES.RECEIVE_SUCCESSFULLY_LOADED_PERMISSIONS,
        payload: {
          arePermissionsGranted: granted,
        },
      });
    } catch (error) {
      await Debug.logError(error);
      dispatch({
        type: ACTION_TYPES.RECEIVE_UNSUCCESSFULLY_LOADED_PERMISSIONS,
      });
    }
  };
};

export const requestAppPermissions = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: ACTION_TYPES.STARTED_LOADING_APP_PERMISSIONS });
    try {
      const granted = await actions.requestAppPermissions();
      dispatch({
        type: ACTION_TYPES.RECEIVE_SUCCESSFULLY_LOADED_PERMISSIONS,
        payload: {
          arePermissionsGranted: granted,
        },
      });
    } catch (error) {
      await Debug.logError(error);
      dispatch({
        type: ACTION_TYPES.RECEIVE_UNSUCCESSFULLY_LOADED_PERMISSIONS,
      });
    }
  };
};
