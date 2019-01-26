// @flow
import type { AppState } from '../../types/redux';

export function isAppInBackground(state: AppState): boolean {
  return state.device.appState == 'background';
}

export function isAppInForeground(state: AppState): boolean {
  return state.device.appState == 'active';
}
