// @flow
import { handleActions } from 'redux-actions';
import { ACTION_TYPES } from './constants';
import { LOADING_STATE } from '../../constants';

import type {
  Action,
  ReceiveLoginPayload,
  ReceiveAuthPayload,
  AuthState,
} from '../../types/redux';

const initialState: AuthState = {
  token: null,
  authLoadingState: LOADING_STATE.NOT_LOADED,
};

const actions = {
  [ACTION_TYPES.START_LOGIN]: startedAuthOrLogin,
  [ACTION_TYPES.RECEIVE_SUCCESSFUL_LOGIN]: receiveAuthOrLogin,
  [ACTION_TYPES.RECEIVE_UNSUCCESSFUL_LOGIN]: receiveFailedAuthOrLogin,
  [ACTION_TYPES.LOAD_AUTH]: startedAuthOrLogin,
  [ACTION_TYPES.RECEIVE_SUCCESSFUL_AUTH]: receiveAuthOrLogin,
  [ACTION_TYPES.RECEIVE_UNSUCCESSFUL_AUTH]: receiveFailedAuthOrLogin,
};

function startedAuthOrLogin(state: AuthState): AuthState {
  return {
    ...state,
    authLoadingState: LOADING_STATE.IS_LOADING,
  };
}

function receiveAuthOrLogin(
  state: AuthState,
  { payload }: Action<ReceiveAuthPayload | ReceiveLoginPayload>
): AuthState {
  if (!payload) {
    return state;
  }
  return {
    ...state,
    token: payload.token,
    authLoadingState: LOADING_STATE.WAS_LOADED_SUCCESSFULLY,
  };
}

function receiveFailedAuthOrLogin(state: AuthState): AuthState {
  return {
    ...state,
    authLoadingState: LOADING_STATE.WAS_LOADED_UNSUCCESSFULLY,
  };
}

export default handleActions(actions, initialState);
