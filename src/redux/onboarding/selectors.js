// @flow
import { LOADING_STATE } from '../../constants';

import type { AppState } from '../../types/redux';

export function arePermissionsGranted(state: AppState): boolean {
  return !!state.onboarding.arePermissionsGranted;
}

export function isLoadingPermissions(state: AppState): boolean {
  return state.onboarding.permissionsLoadingState === LOADING_STATE.IS_LOADING;
}
