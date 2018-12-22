// @flow
import { handleActions } from 'redux-actions';
import { ACTION_TYPES } from './constants';

import type { Action, ReceiveLoginPayload, AuthState } from '../../types/redux';

const initialState: AuthState = {
  token: null,
};

const actions = {
  [ACTION_TYPES.RECEIVE_SUCCESSFUL_LOGIN]: receiveLogin,
};

function receiveLogin(
  state: AuthState,
  { payload }: Action<ReceiveLoginPayload>
): AuthState {
  if (!payload) {
    return state;
  }
  return addToken(state, payload.token);
}

function addToken({ ...state }: AuthState, token: string): AuthState {
  return {
    ...state,
    token: token,
  };
}

export default handleActions(actions, initialState);
