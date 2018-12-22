// @flow
import fromPairs from 'lodash/fromPairs';

export function prefixWithModuleName(
  moduleName: string,
  actionTypes: string[]
): { [key: string]: string } {
  const pairs = actionTypes.map(actionType => [
    actionType,
    `${moduleName}.${actionType}`,
  ]);
  return fromPairs(pairs);
}

export function enumFromArray(keys: string[]): { [key: string]: string } {
  const pairs = keys.map(key => [key, key]);
  return fromPairs(pairs);
}
