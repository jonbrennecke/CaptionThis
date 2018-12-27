// @flow
import { prefixWithModuleName } from '../utils';

export const ONBOARDING = 'onboarding';

export const ACTION_TYPES = prefixWithModuleName(ONBOARDING, [
  'STARTED_LOADING_APP_PERMISSIONS',
  'RECEIVE_SUCCESSFULLY_LOADED_PERMISSIONS',
  'RECEIVE_UNSUCCESSFULLY_LOADED_PERMISSIONS',
]);
