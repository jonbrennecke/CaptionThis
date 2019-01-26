// @flow
import { handleActions } from 'redux-actions';
import { ACTION_TYPES } from './constants';

import type {
  Action,
  ReceiveAppStateChangePayload,
  DeviceState,
} from '../../types/redux';

const initialState: DeviceState = {
  appState: 'active',
};

const actions = {
  [ACTION_TYPES.DID_RECEIVE_APP_STATE_CHANGE]: receiveAppStateChange
};

function receiveAppStateChange(state: DeviceState, { payload }: Action<ReceiveAppStateChangePayload>): DeviceState {
  if (!payload) {
    return state;
  }
  return {
    ...state,
    appState: payload.appState,
  };
}

export default handleActions(actions, initialState);
