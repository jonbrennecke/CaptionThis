// @flow
import fromPairs from 'lodash/fromPairs';

export const AUTH = 'auth';

export const ACTION_TYPES = prefixWithModuleName(AUTH, [
  'START_LOGIN',
  'RECEIVE_SUCCESSFUL_LOGIN',
  'LOAD_AUTH',
  'RECEIVE_AUTH_TOKEN',
]);

function prefixWithModuleName(
  moduleName: string,
  actionTypes: string[]
): { [key: string]: string } {
  const pairs = actionTypes.map(actionType => [
    actionType,
    `${moduleName}.${actionType}`,
  ]);
  return fromPairs(pairs);
}
