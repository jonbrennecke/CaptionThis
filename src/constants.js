// @flow
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import type { FontRole, FontStyle } from './types/fonts';

export const APP_BUNDLE_ID = DeviceInfo.getBundleId();

export const API_BASE_URL = 'https://reqres.in/api';

export const LOADING_STATE = {
  NOT_LOADED: 'NOT_LOADED',
  IS_LOADING: 'IS_LOADING',
  WAS_LOADED_SUCCESSFULLY: 'WAS_LOADED_SUCCESSFULLY',
  WAS_LOADED_UNSUCCESSFULLY: 'WAS_LOADED_UNSUCCESSFULLY',
};

export const FONT_SIZES = [
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
];

export const TEXT_COLORS = {
  LIGHT_GREY: '#B7BAE1',
  MEDIUM_GREY: '#817E98',
  DARK_GREY: '#332A38',
  WHITE: '#FFF',
  OFF_WHITE: '#F6F6FD',
};

export const UI_COLORS = {
  WHITE: '#FFFFFF',
  OFF_WHITE: '#F6F6FD',
  DARK_GREY: '#332A38',
  BLACK: '#000',
  LIGHT_GREY: '#ACABB4',
  EXTRA_LIGHT_GREY: '#B7BAE1',
  MEDIUM_RED: '#f4a09c',
  LIGHT_BLUE: '#8CD4D2',
  LIGHT_GREEN: '#D5FAE0',
  MEDIUM_GREEN: '#53B1AF',
  DARK_GREEN: '#314A48',
  OFF_BLACK: '#1A1818',
};

export const USER_COLOR_CHOICES = [
  '#D0021B',
  '#F5A623',
  '#F8E71C',
  '#8B572A',
  '#7ED321',
  '#417505',
  '#588C1B',
  '#0000FF',
  '#BD10E0',
  '#9013FE',
  '#4A90E2',
  '#50E3C2',
  '#000000',
  '#4A4A4A',
  '#9B9B9B',
  '#FFFFFF',
];

export const USER_EDITABLE_COLORS = {
  BACKGROUND_COLOR: 'BACKGROUND_COLOR',
  TEXT_COLOR: 'TEXT_COLOR',
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
  STAATLICHES: 'Staatliches',
  SOURCE_SERIF_PRO: 'Source Serif Pro',
  SOURCE_SANS_PRO: 'Source Sans Pro',
  LOBSTER: 'Lobster',
  CRETE_ROUND: 'Crete Round',
  RUBIK: 'Rubik',
};

export const FONTS = [
  {
    fontFamily: FONT_FAMILIES.CRETE_ROUND,
    displayName: 'Crete Round',
  },
  {
    fontFamily: FONT_FAMILIES.LOBSTER,
    displayName: 'Lobster',
  },
  {
    fontFamily: FONT_FAMILIES.SOURCE_SANS_PRO,
    displayName: 'Source Sans Pro',
  },
  {
    fontFamily: FONT_FAMILIES.SOURCE_SERIF_PRO,
    displayName: 'Source Serif Pro',
  },
  {
    fontFamily: FONT_FAMILIES.STAATLICHES,
    displayName: 'Staatliches',
  },
  {
    fontFamily: FONT_FAMILIES.RUBIK,
    displayName: 'Rubik',
  },
];

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
      fontFamily: FONT_FAMILIES.SOURCE_SANS_PRO,
      fontSize: 20,
    },
  },
  formLabel: {
    style: {
      color: TEXT_COLORS.LIGHT_GREY,
      fontFamily: FONT_FAMILIES.PT_SANS_REGULAR,
      fontSize: 11,
      letterSpacing: 1.8,
      fontWeight: 'bold',
    },
    modifiers: [
      {
        name: 'lightContent',
        style: {
          color: TEXT_COLORS.LIGHT_GREY,
        },
      },
    ],
  },
  button: {
    style: {
      color: TEXT_COLORS.WHITE,
      fontFamily: FONT_FAMILIES.STAATLICHES,
      fontSize: 17,
      letterSpacing: 1.8,
    },
    modifiers: [
      {
        name: 'small',
        style: {
          fontSize: 11,
        },
      },
      {
        name: 'large',
        style: {
          fontSize: 27,
        },
      },
      {
        name: 'darkContent',
        style: {
          color: TEXT_COLORS.DARK_GREY,
        },
      },
    ],
  },
  heading: {
    style: {
      color: TEXT_COLORS.DARK_GREY,
      fontFamily: FONT_FAMILIES.PT_SANS_REGULAR,
      fontSize: 19,
      fontWeight: 'bold',
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
      {
        name: 'large',
        style: {
          fontSize: 26,
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
      color: TEXT_COLORS.OFF_WHITE,
      fontFamily: FONT_FAMILIES.STAATLICHES,
      fontSize: 23,
      fontWeight: 'bold',
      letterSpacing: 1.2,
    },
  },
};

export const SCREENS = {
  HOME_SCREEN: `${APP_BUNDLE_ID}.HomeScreen`,
  EDIT_SCREEN: `${APP_BUNDLE_ID}.EditScreen`,
  LOGIN_MODAL: `${APP_BUNDLE_ID}.LoginModal`,
  ONBOARDING_MODAL: `${APP_BUNDLE_ID}.LoginModal`,
  FONT_MODAL: `${APP_BUNDLE_ID}.FontModal`,
  COLOR_MODAL: `${APP_BUNDLE_ID}.ColorModal`,
  EDIT_TRANSCRIPTION_MODAL: `${APP_BUNDLE_ID}.EditTranscriptionModal`,
};

export const APP_ORIENTATIONS = ['portrait'];

export const SCREEN_PARAMS = {
  [SCREENS.LOGIN_MODAL]: {
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
  [SCREENS.HOME_SCREEN]: {
    component: {
      name: SCREENS.HOME_SCREEN,
      id: SCREENS.HOME_SCREEN,
      passProps: {},
      options: {
        statusBar: {
          style: 'light',
        },
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
  [SCREENS.ONBOARDING_MODAL]: {
    component: {
      name: SCREENS.ONBOARDING_MODAL,
      id: SCREENS.ONBOARDING_MODAL,
      passProps: {},
      options: {
        statusBar: {
          style: 'light',
        },
        modalPresentationStyle: 'overFullScreen',
        topBar: {
          visible: false,
          animate: false,
        },
        layout: {
          orientation: APP_ORIENTATIONS,
          backgroundColor: 'transparent',
        },
        animations: {
          showModal: {
            enabled: false,
          },
        },
      },
    },
  },
  [SCREENS.FONT_MODAL]: {
    component: {
      name: SCREENS.FONT_MODAL,
      id: SCREENS.FONT_MODAL,
      passProps: {},
      options: {
        statusBar: {
          style: 'light',
        },
        modalPresentationStyle: 'overFullScreen',
        topBar: {
          visible: false,
          animate: false,
        },
        layout: {
          backgroundColor: 'transparent',
          orientation: APP_ORIENTATIONS,
        },
      },
    },
  },
  [SCREENS.COLOR_MODAL]: {
    component: {
      name: SCREENS.COLOR_MODAL,
      id: SCREENS.COLOR_MODAL,
      passProps: {},
      options: {
        statusBar: {
          style: 'light',
        },
        modalPresentationStyle: 'overFullScreen',
        topBar: {
          visible: false,
          animate: false,
        },
        layout: {
          backgroundColor: 'transparent',
          orientation: APP_ORIENTATIONS,
        },
      },
    },
  },
  [SCREENS.EDIT_SCREEN]: {
    component: {
      name: SCREENS.EDIT_SCREEN,
      id: SCREENS.EDIT_SCREEN,
      passProps: {},
      options: {
        statusBar: {
          style: 'light',
        },
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
  [SCREENS.EDIT_TRANSCRIPTION_MODAL]: {
    component: {
      name: SCREENS.EDIT_TRANSCRIPTION_MODAL,
      id: SCREENS.EDIT_TRANSCRIPTION_MODAL,
      passProps: {},
      options: {
        statusBar: {
          style: 'dark',
        },
        modalPresentationStyle: 'overFullScreen',
        topBar: {
          visible: false,
          animate: false,
        },
        layout: {
          backgroundColor: 'transparent',
          orientation: APP_ORIENTATIONS,
        },
      },
    },
  },
};
