// @flow
import { Navigation } from 'react-native-navigation';

import HomeScreen from './home/HomeScreen';
import LoginModal from './login/LoginModal';
import EditScreen from './edit/EditScreen';
import FontModal from './fonts/FontModal';
import ColorModal from './color/ColorModal';
import EditTranscriptionModal from './edit-transcription/EditTranscriptionModal';
import { SCREENS } from '../constants';

import type { Element } from 'react';

export function registerScreens(reduxStore: any, ReduxProvider: Element<*>) {
  // TODO convert to Map<$Keys<SCREENS.HOME_SCREEN>, fn>
  [
    [SCREENS.HOME_SCREEN, () => HomeScreen],
    [SCREENS.LOGIN_MODAL, () => LoginModal],
    [SCREENS.EDIT_SCREEN, () => EditScreen],
    [SCREENS.FONT_MODAL, () => FontModal],
    [SCREENS.COLOR_MODAL, () => ColorModal],
    [SCREENS.EDIT_TRANSCRIPTION_MODAL, () => EditTranscriptionModal],
  ].forEach(([screen, fn]) =>
    Navigation.registerComponentWithRedux(screen, fn, ReduxProvider, reduxStore)
  );
}
