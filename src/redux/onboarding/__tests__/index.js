// @flow
import createStore from '../../store';
// import { loadAppPermissions } from '../actionCreators';
import { arePermissionsGranted } from '../selectors';

test('login attempt with correct credentials works', async () => {
  const store = createStore();
  const state = store.getState();
  expect(arePermissionsGranted(state)).toBe(false);
  //   await store.dispatch(login('jpbrennecke@gmail.com', 'password'));
  //   const nextState = store.getState();
  //   expect(isLoggedIn(nextState)).toBe(true);
});

// test('login attempt with missing credentials results in failed login', async () => {
//   const store = createStore();
//   const state = store.getState();
//   expect(isLoggedIn(state)).toBe(false);
//   await store.dispatch(login('jpbrennecke@gmail.com', ''));
//   const nextState = store.getState();
//   expect(isLoggedIn(nextState)).toBe(true);
// });
