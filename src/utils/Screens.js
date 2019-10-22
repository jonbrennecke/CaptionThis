// @flow

import merge from 'lodash/merge';

import { SCREEN_PARAMS, SCREENS, APP_BUNDLE_ID } from '../constants';

import type { MediaObject } from '@jonbrennecke/react-native-media';

const ROOT_NAVIGATION_STACK_ID = `${APP_BUNDLE_ID}.RootStack`;

export const pushEditScreen = async (
  currentComponentId: string,
  video: MediaObject
) => {
  await Navigation.push(
    currentComponentId,
    merge(
      { ...SCREEN_PARAMS[SCREENS.EDIT_SCREEN] },
      passPropsComponentMergeParams({ video })
    )
  );
};

function passPropsComponentMergeParams(props: { [key: string]: any }) {
  return {
    component: {
      passProps: props,
    },
  };
}

export const pushTranscriptionReviewScreen = async (
  currentComponentId: string,
  video: MediaObject
) => {
  await Navigation.push(
    currentComponentId,
    merge(
      { ...SCREEN_PARAMS[SCREENS.TRANSCRIPTION_REVIEW_SCREEN] },
      passPropsComponentMergeParams({ video })
    )
  );
};

export const dismissTranscriptionReviewScreen = async () => {
  await Navigation.pop(SCREENS.TRANSCRIPTION_REVIEW_SCREEN);
};

// const AppNavigator = createStackNavigator({
//   Home: {
//     screen: HomeScreen,
//   },
// });

// export default createAppContainer(AppNavigator);
