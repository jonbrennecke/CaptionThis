// @flow
import React from 'react';
// eslint-disable-next-line import/named
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import HomeScreen from './home/HomeScreen';
import EditScreen from './edit/EditScreen';
import { TranscriptionReviewModal } from './edit/transcriptionReviewModal';
import { SCREENS } from '../constants';

import type { ComponentType } from 'react';

const AppNavigator = createStackNavigator(
  {
    [SCREENS.HOME_SCREEN]: {
      screen: HomeScreen,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    [SCREENS.EDIT_SCREEN]: {
      screen: EditScreen,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    [SCREENS.TRANSCRIPTION_REVIEW_SCREEN]: {
      screen: TranscriptionReviewModal,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
  },
  {
    initialRouteName: SCREENS.HOME_SCREEN,
    headerMode: 'none',
    mode: 'modal',
  }
);

export function createScreens(
  reduxStore: any,
  ReduxProvider: ComponentType<*>
) {
  const AppContainer = createAppContainer(AppNavigator);
  const App = () => (
    <ReduxProvider store={reduxStore}>
      <AppContainer />
    </ReduxProvider>
  );
  return App;
}
