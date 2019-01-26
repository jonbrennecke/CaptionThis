// @flow
import { ACTION_TYPES } from './constants';

import type { Dispatch, ReceiveAppStateChangePayload } from '../../types/redux';
import type { ReactAppStateEnum } from '../../types/react';

export const receiveAppStateChange = (appState: ReactAppStateEnum) => {
  return async (dispatch: Dispatch<ReceiveAppStateChangePayload>) => {
    dispatch({
    type: ACTION_TYPES.DID_RECEIVE_APP_STATE_CHANGE,
    payload: {
        appState,
    },
    });
  };
};