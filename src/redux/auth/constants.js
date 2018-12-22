// @flow
import { prefixWithModuleName } from '../utils';

export const AUTH = 'auth';

export const ACTION_TYPES = prefixWithModuleName(AUTH, [
  'START_LOGIN',
  'RECEIVE_SUCCESSFUL_LOGIN',
  'RECEIVE_UNSUCCESSFUL_LOGIN',
  'LOAD_AUTH',
  'RECEIVE_SUCCESSFUL_AUTH',
  'RECEIVE_UNSUCCESSFUL_AUTH',
]);
