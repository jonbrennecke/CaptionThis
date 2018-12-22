// @flow
import isNil from 'lodash/isNil';

export function isValidEmail(email: ?string): boolean {
  return !isNil(email);
}

export function isValidPassword(password: ?string): boolean {
  return !isNil(password);
}
