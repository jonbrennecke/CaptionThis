// @flow
import type { AppState } from '../../types/redux';

export function getToken(state: AppState): ?string {
  return state.auth.token;
}

export function isLoggedIn(state: AppState): boolean {
  return !!getToken(state);
}
