// @flow
import { Navigation } from 'react-native-navigation';

import { SCREEN_PARAMS, SCREENS } from '../constants';

export function showLoginModal() {
  Navigation.showModal(SCREEN_PARAMS[SCREENS.LOGIN_MODAL]);
}
