// @flow
import { Navigation } from 'react-native-navigation';
import merge from 'lodash/merge';

import {
  SCREEN_PARAMS,
  SCREENS,
  APP_BUNDLE_ID,
  USER_EDITABLE_COLORS,
} from '../constants';

import type { VideoAssetIdentifier } from '../types/media';

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

export const showFontModal = async () => {
  await Navigation.showModal({
    stack: {
      children: [SCREEN_PARAMS[SCREENS.FONT_MODAL]],
    },
  });
};

export const dismissFontModal = async () => {
  await Navigation.dismissModal(SCREENS.FONT_MODAL);
};

export const showColorModal = async (
  editableColor: $Keys<typeof USER_EDITABLE_COLORS>
) => {
  await Navigation.showModal({
    stack: {
      children: [
        merge(
          { ...SCREEN_PARAMS[SCREENS.COLOR_MODAL] },
          passPropsComponentMergeParams({ editableColor })
        ),
      ],
    },
  });
};

export const dismissColorModal = async () => {
  await Navigation.dismissModal(SCREENS.COLOR_MODAL);
};

export const pushEditScreen = async (
  currentComponentId: string,
  videoAssetIdentifier: VideoAssetIdentifier
) => {
  await Navigation.push(
    currentComponentId,
    merge(
      { ...SCREEN_PARAMS[SCREENS.EDIT_SCREEN] },
      passPropsComponentMergeParams({ videoAssetIdentifier })
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
