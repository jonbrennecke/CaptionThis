// @flow
import { handleActions } from 'redux-actions';
import { ACTION_TYPES } from './constants';
import { LOADING_STATE } from '../../constants';

import type {
  Action,
  ReceivePermissionsPayload,
  OnboardingState,
} from '../../types/redux';

const initialState: OnboardingState = {
  arePermissionsGranted: false,
  permissionsLoadingState: LOADING_STATE.NOT_LOADED,
};

const actions = {
  [ACTION_TYPES.LOAD_APP_PERMISSIONS]: startedLoadingAppPermissions,
  [ACTION_TYPES.RECEIVE_SUCCESSFULLY_LOADED_PERMISSIONS]: receiveSuccessfullyLoadedPermissions,
  [ACTION_TYPES.RECEIVE_UNSUCCESSFULLY_LOADED_PERMISSIONS]: receiveUnsuccessfullyLoadedPermissions,
};

function startedLoadingAppPermissions(state: OnboardingState): OnboardingState {
  return {
    ...state,
    permissionsLoadingState: LOADING_STATE.IS_LOADING,
  };
}

function receiveSuccessfullyLoadedPermissions(
  state: OnboardingState,
  { payload }: Action<ReceivePermissionsPayload>
): OnboardingState {
  if (!payload) {
    return state;
  }
  return {
    ...state,
    arePermissionsGranted: payload.arePermissionsGranted,
    permissionsLoadingState: LOADING_STATE.WAS_LOADED_SUCCESSFULLY,
  };
}

function receiveUnsuccessfullyLoadedPermissions(
  state: OnboardingState
): OnboardingState {
  return {
    ...state,
    permissionsLoadingState: LOADING_STATE.WAS_LOADED_UNSUCCESSFULLY,
  };
}

export default handleActions(actions, initialState);
