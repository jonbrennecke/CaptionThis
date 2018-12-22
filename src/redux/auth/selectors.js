// @flow
import { LOADING_STATE } from '../../constants';

import type { AppState } from '../../types/redux';

export function getToken(state: AppState): ?string {
  return state.auth.token;
}

export function isLoggedIn(state: AppState): boolean {
  const wasLoaded =
    state.auth.authLoadingState == LOADING_STATE.WAS_LOADED_SUCCESSFULLY;
  const hasToken = !!getToken(state);
  return wasLoaded && hasToken;
}
