// @flow
import { Navigation } from 'react-native-navigation';
import merge from 'lodash/merge';

import { SCREEN_PARAMS, SCREENS, APP_BUNDLE_ID } from '../constants';

import type { VideoObject } from '../types/media';

const ROOT_NAVIGATION_STACK_ID = `${APP_BUNDLE_ID}.RootStack`;

export const showLoginModal = async () => {
  await Navigation.showModal({
    stack: {
      children: [SCREEN_PARAMS[SCREENS.LOGIN_MODAL]],
    },
  });
};

export const dismissLoginModal = async () => {
  await Navigation.dismissModal(SCREENS.LOGIN_MODAL);
};

export const pushEditScreen = async (
  currentComponentId: string,
  video: VideoObject
) => {
  await Navigation.push(
    currentComponentId,
    merge(
      { ...SCREEN_PARAMS[SCREENS.EDIT_SCREEN] },
      passPropsComponentMergeParams({ video })
    )
  );
};

export function setRoot() {
  Navigation.setRoot({
    root: {
      stack: {
        id: ROOT_NAVIGATION_STACK_ID,
        children: [SCREEN_PARAMS[SCREENS.HOME_SCREEN]],
      },
    },
  });
}

function passPropsComponentMergeParams(props: { [key: string]: any }) {
  return {
    component: {
      passProps: props,
    },
  };
}
