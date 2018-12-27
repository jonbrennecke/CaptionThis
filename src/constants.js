// @flow
import { Platform } from 'react-native';

import type { FontRole, FontStyle } from './types/fonts';

export const APP_BUNDLE_ID = 'com.jonbrennecke.loginApp'; // TODO use DeviceInfo

export const API_BASE_URL = 'https://reqres.in/api';

export const LOADING_STATE = {
  NOT_LOADED: 'NOT_LOADED',
  IS_LOADING: 'IS_LOADING',
  WAS_LOADED_SUCCESSFULLY: 'WAS_LOADED_SUCCESSFULLY',
  WAS_LOADED_UNSUCCESSFULLY: 'WAS_LOADED_UNSUCCESSFULLY',
};

export const TEXT_COLORS = {
  LIGHT_GREY: '#B7BAE1',
  MEDIUM_GREY: '#50548E',
  DARK_GREY: '#3B3E6F',
  WHITE: '#FFF',
  OFF_WHITE: '#F6F6FD',
};

export const UI_COLORS = {
  WHITE: '#FFF',
  OFF_WHITE: '#F6F6FD',
  DARK_GREY: '#3B3E6F',
  LIGHT_GREY: '#B7BAE1',
  EXTRA_LIGHT_GREY: '#B7BAE1',
  MEDIUM_RED: '#f4a09c',
};

export const FONT_FAMILIES = {
  PASSION_ONE: 'PassionOne-Regular',
  PT_SANS_REGULAR: Platform.select({
    ios: 'PT Sans',
    android: 'PT_Sans-Web-Regular',
  }),
  PT_SANS_BOLD: Platform.select({
    ios: 'PT Sans',
    android: 'PT_Sans-Web-Bold',
  }),
};

export const FONT_STYLES: { [key: FontRole]: FontStyle } = {
  default: {
    style: {
      color: TEXT_COLORS.DARK_GREY,
      fontFamily: FONT_FAMILIES.PT_SANS_REGULAR,
      fontSize: 13,
    },
    modifiers: [
      {
        name: 'lightContent',
        style: {
          color: TEXT_COLORS.OFF_WHITE,
        },
      },
    ],
  },
  formInput: {
    style: {
      color: TEXT_COLORS.DARK_GREY,
      fontFamily: FONT_FAMILIES.PT_SANS_REGULAR,
      fontSize: 17,
    },
  },
  formLabel: {
    style: {
      color: TEXT_COLORS.DARK_GREY,
      fontFamily: FONT_FAMILIES.PT_SANS_REGULAR,
      fontSize: 11,
      letterSpacing: 1.8,
    },
  },
  button: {
    style: {
      color: TEXT_COLORS.WHITE,
      fontFamily: FONT_FAMILIES.PT_SANS_REGULAR,
      fontSize: 15,
      letterSpacing: 1.8,
    },
    modifiers: [
      {
        name: 'small',
        style: {
          fontSize: 11,
        },
      },
    ],
  },
  heading: {
    style: {
      color: TEXT_COLORS.MEDIUM_GREY,
      fontFamily: FONT_FAMILIES.PT_SANS_REGULAR,
      fontSize: 23,
    },
    modifiers: [
      {
        name: 'lightContent',
        style: {
          color: TEXT_COLORS.WHITE,
        },
      },
      {
        name: 'small',
        style: {
          fontSize: 13,
        },
      },
    ],
  },
  callToAction: {
    style: {
      color: TEXT_COLORS.MEDIUM_GREY,
      fontFamily: FONT_FAMILIES.PT_SANS_REGULAR,
      fontSize: 23,
      textAlign: 'center',
    },
  },
  title: {
    style: {
      color: TEXT_COLORS.MEDIUM_GREY,
      fontFamily: FONT_FAMILIES.PT_SANS_REGULAR,
      fontSize: 23,
      fontWeight: 'bold',
      letterSpacing: 1.2,
    },
  },
};

export const SCREENS = {
  HOME_SCREEN: `${APP_BUNDLE_ID}.HomeScreen`,
  LOGIN_MODAL: `${APP_BUNDLE_ID}.LoginModal`,
  ONBOARDING_MODAL: `${APP_BUNDLE_ID}.LoginModal`,
};

export const APP_ORIENTATIONS = ['portrait'];

export const SCREEN_PARAMS = {
  [SCREENS.LOGIN_MODAL]: {
    stack: {
      children: [
        {
          component: {
            name: SCREENS.LOGIN_MODAL,
            id: SCREENS.LOGIN_MODAL,
            passProps: {},
            options: {
              topBar: {
                title: {
                  text: 'Login',
                  color: TEXT_COLORS.DARK_GREY,
                  fontFamily: FONT_FAMILIES.PT_SANS_REGULAR,
                  fontWeight: 'bold',
                  fontSize: 15,
                },
              },
              overlay: {
                interceptTouchOutside: true,
              },
              layout: {
                orientation: APP_ORIENTATIONS,
              },
            },
          },
        },
      ],
    },
  },
  [SCREENS.HOME_SCREEN]: {
    stack: {
      children: [
        {
          component: {
            name: SCREENS.HOME_SCREEN,
            id: SCREENS.HOME_SCREEN,
            passProps: {},
            options: {
              topBar: {
                title: {
                  text: 'Home',
                  color: TEXT_COLORS.DARK_GREY,
                  fontFamily: FONT_FAMILIES.PT_SANS_REGULAR,
                  fontWeight: 'bold',
                  fontSize: 15,
                },
              },
              layout: {
                orientation: APP_ORIENTATIONS,
              },
            },
          },
        },
      ],
    },
  },
  [SCREENS.ONBOARDING_MODAL]: {
    stack: {
      children: [
        {
          component: {
            name: SCREENS.ONBOARDING_MODAL,
            id: SCREENS.ONBOARDING_MODAL,
            passProps: {},
            options: {
              modalPresentationStyle: 'overFullScreen',
              topBar: {
                visible: false,
                animate: false,
              },
              layout: {
                orientation: APP_ORIENTATIONS,
              },
            },
          },
        },
      ],
    },
  },
};
