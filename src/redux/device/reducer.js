// @flow
import { handleActions } from 'redux-actions';
import { ACTION_TYPES } from './constants';

import type {
  Action,
  ReceiveAppStateChangePayload,
  ReceiveDeviceInfoPayload,
  DeviceState,
} from '../../types/redux';

const initialState: DeviceState = {
  appState: 'active',
  deviceInfo: null,
};

const actions = {
  [ACTION_TYPES.DID_RECEIVE_APP_STATE_CHANGE]: receiveAppStateChange,
  [ACTION_TYPES.DID_RECEIVE_DEVICE_INFO]: receiveDeviceInfo,
};

function receiveAppStateChange(
  state: DeviceState,
  { payload }: Action<ReceiveAppStateChangePayload>
): DeviceState {
  if (!payload) {
    return state;
  }
  return {
    ...state,
    appState: payload.appState,
  };
}

function receiveDeviceInfo(
  state: DeviceState,
  { payload }: Action<ReceiveDeviceInfoPayload>
): DeviceState {
  if (!payload) {
    return state;
  }
  return {
    ...state,
    deviceInfo: payload.deviceInfo,
  };
}

export default handleActions(actions, initialState);
