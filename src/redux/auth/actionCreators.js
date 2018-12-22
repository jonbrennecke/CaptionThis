// @flow
import { AsyncStorage } from 'react-native';
import * as actions from './actions';
import * as Debug from '../../utils/Debug';
import { ACTION_TYPES } from './constants';
import { APP_BUNDLE_ID } from '../../constants';

import type { Dispatch } from '../../types/redux';

export const login = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: ACTION_TYPES.START_LOGIN });
    try {
      const token = actions.login(email, password);
      dispatch({
        type: ACTION_TYPES.RECEIVE_SUCCESSFUL_LOGIN,
        payload: {
          token,
        },
      });
    } catch (error) {
      await Debug.logError(error);
      dispatch({ type: ACTION_TYPES.RECEIVE_UNSUCCESSFUL_LOGIN });
    }
  };
};

export const loadAuth = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: ACTION_TYPES.LOAD_AUTH });
    try {
      const token = await AsyncStorage.getItem(`${APP_BUNDLE_ID}.auth.token`);
      if (token !== null) {
        dispatch({
          type: ACTION_TYPES.RECEIVE_SUCCESSFUL_AUTH,
          payload: {
            token,
          },
        });
      }
    } catch (error) {
      await Debug.logError(error);
    }
    dispatch({ type: ACTION_TYPES.RECEIVE_UNSUCCESSFUL_AUTH });
  };
};
