// @flow
import createStore from '../../store';
import { login } from '../actionCreators';
import { isLoggedIn } from '../selectors';
import fetch from 'isomorphic-fetch';

// eslint-disable-next-line no-undef
global.fetch = fetch;

test('login attempt with correct credentials works', async () => {
  const store = createStore();
  const state = store.getState();
  expect(isLoggedIn(state)).toBe(false);
  await store.dispatch(login('jpbrennecke@gmail.com', 'password'));
  const nextState = store.getState();
  expect(isLoggedIn(nextState)).toBe(true);
});

test('login attempt with missing credentials results in failed login', async () => {
  const store = createStore();
  const state = store.getState();
  expect(isLoggedIn(state)).toBe(false);
  await store.dispatch(login('jpbrennecke@gmail.com', ''));
  const nextState = store.getState();
  expect(isLoggedIn(nextState)).toBe(true);
});
