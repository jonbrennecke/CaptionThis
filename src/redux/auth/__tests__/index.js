// @flow
import createStore from '../../store';
import { login } from '../actionCreators';
import { isLoggedIn } from '../selectors';

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
