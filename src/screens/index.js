// @flow
import { Navigation } from 'react-native-navigation';

import HomeScreen from './home/HomeScreen';
import EditScreen from './edit/EditScreen';
import { TranscriptionReviewModal } from './edit/transcriptionReviewModal';
import { SCREENS } from '../constants';

import type { Element } from 'react';

export function registerScreens(reduxStore: any, ReduxProvider: Element<*>) {
  [
    [SCREENS.HOME_SCREEN, () => HomeScreen],
    [SCREENS.EDIT_SCREEN, () => EditScreen],
    [SCREENS.TRANSCRIPTION_REVIEW_SCREEN, () => TranscriptionReviewModal],
  ].forEach(([screen, fn]) =>
    Navigation.registerComponentWithRedux(screen, fn, ReduxProvider, reduxStore)
  );
}
