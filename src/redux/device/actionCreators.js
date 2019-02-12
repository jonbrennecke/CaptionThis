// @flow
import { ACTION_TYPES } from './constants';
import * as Device from '../../utils/Device';

import type {
  Dispatch,
  ReceiveAppStateChangePayload,
  ReceiveDeviceInfoPayload,
} from '../../types/redux';
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

export const loadDeviceInfo = () => {
  return async (dispatch: Dispatch<ReceiveDeviceInfoPayload>) => {
    const deviceInfo = await Device.getDeviceInfo();
    dispatch({
      type: ACTION_TYPES.DID_RECEIVE_DEVICE_INFO,
      payload: {
        deviceInfo,
      },
    });
  };
};
