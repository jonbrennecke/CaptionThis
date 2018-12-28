// @flow
import * as actions from './actions';
import * as Debug from '../../utils/Debug';
import { ACTION_TYPES } from './constants';

import type { Dispatch } from '../../types/redux';

export const loadVideoAssets = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: ACTION_TYPES.DID_START_LOADING_VIDEO_ASSETS });
    try {
      const ids = await actions.loadVideoAssets();
      dispatch({
        type: ACTION_TYPES.DID_SUCCESSFULLY_LOAD_VIDEO_ASSETS,
        payload: {
          videoAssetIdentifiers: ids,
        },
      });
    } catch (error) {
      await Debug.logError(error);
      dispatch({ type: ACTION_TYPES.DID_UNSUCCESSFULLY_LOAD_VIDEO_ASSETS });
    }
  };
};
