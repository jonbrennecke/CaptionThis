// @flow
import { Navigation } from 'react-native-navigation';

import HomeScreen from './home/HomeScreen';
import LoginModal from './login/LoginModal';
import EditScreen from './edit/EditScreen';
import { TranscriptionReviewModal } from './edit/transcriptionReviewModal';
import { SCREENS } from '../constants';

import type { Element } from 'react';

export function registerScreens(reduxStore: any, ReduxProvider: Element<*>) {
  // TODO convert to Map<$Keys<SCREENS.HOME_SCREEN>, fn>
  [
    [SCREENS.HOME_SCREEN, () => HomeScreen],
    [SCREENS.LOGIN_MODAL, () => LoginModal],
    [SCREENS.EDIT_SCREEN, () => EditScreen],
    [SCREENS.TRANSCRIPTION_REVIEW_SCREEN, () => TranscriptionReviewModal],
  ].forEach(([screen, fn]) =>
    Navigation.registerComponentWithRedux(screen, fn, ReduxProvider, reduxStore)
  );
}
