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

export const TRANSCRIPTION_STATE = {
  NONE: 'NONE',
  IN_PROGRESS: 'IN_PROGRESS',
  FINISHED_SUCCESSFULLY: 'FINISHED_SUCCESSFULLY',
  FAILED: 'FAILED',
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
  LIGHT_GREY: '#AFADAD',
  MEDIUM_GREY: '#353434',
  DARK_GREY: '#1A1E1D',
  WHITE: '#FFF',
  OFF_WHITE: '#F6F6FD',
};

export const UI_COLORS = {
  WHITE: '#FFFFFF',
  OFF_WHITE: '#BCCCDD',
  MEDIUM_GREY: '#353434',
  DARK_GREY: '#1A1E1D',
  BLACK: '#000',
  LIGHT_GREY: '#ACABB4',
  EXTRA_LIGHT_GREY: '#B7BAE1',
  MEDIUM_RED: '#f4a09c',
  LIGHT_BLUE: '#8CD4D2',
  LIGHT_GREEN: '#D5FAE0',
  MEDIUM_GREEN: '#00CF9D',
  DARK_GREEN: '#314A48',
  OFF_BLACK: '#1A1818',
};

export const USER_BACKGROUND_COLOR_CHOICES = [
  '#BCCCDD',
  '#2F5181',
  '#71AC9B',
  '#97C189',
  '#DCE8D9',
  '#FAE8BB',
  '#FDF6CA',
  '#EEB736',
  '#DE7A5C',
  '#AE292A',
  '#E45858',
  '#F2D3CE',
  '#DCD2D0',
  '#E7DBEE',
  '#AE9EC3',
  '#FFFFFF',
  '#9B9B9B',
  '#4A4A4A',
  '#000000',
];

export const USER_TEXT_COLOR_CHOICES = ['#FFFFFF', '#000000', '#ffff00'];

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
  ROBOTO: 'Roboto',
  CUTIVE_MONO: 'Cutive Mono',
  DANCING_SCRIPT: 'Dancing Script',
  MONTSERRAT: 'Montserrat',
  SHADOWS_INTO_LIGHT: 'Shadows Into Light',
  SPECIAL_ELITE: 'Special Elite',
  AMATIC: 'AmaticSC-Bold',
  BANGERS: 'Bangers',
  RIGHTEOUS: 'Righteous',
  IBM_PLEX_MONO: 'IBMPlexMono-Medium',
};

export const FONTS = [
  {
    fontFamily: FONT_FAMILIES.CRETE_ROUND,
    displayName: 'Crete Round',
  },
  // FIXME: font tails get cut off, disabled until fixed
  // {
  //   fontFamily: FONT_FAMILIES.SHADOWS_INTO_LIGHT,
  //   displayName: 'Shadows Into Light',
  // },
  {
    fontFamily: FONT_FAMILIES.BANGERS,
    displayName: 'Bangers',
  },
  {
    fontFamily: FONT_FAMILIES.RIGHTEOUS,
    displayName: 'Righteous',
  },
  {
    fontFamily: FONT_FAMILIES.SPECIAL_ELITE,
    displayName: 'Special Elite',
  },
  {
    fontFamily: FONT_FAMILIES.LOBSTER,
    displayName: 'Lobster',
  },
  {
    fontFamily: FONT_FAMILIES.AMATIC,
    displayName: 'Amatic SC',
  },
  {
    fontFamily: FONT_FAMILIES.STAATLICHES,
    displayName: 'Staatliches',
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
    fontFamily: FONT_FAMILIES.RUBIK,
    displayName: 'Rubik',
  },
  {
    fontFamily: FONT_FAMILIES.ROBOTO,
    displayName: 'Roboto',
  },
  {
    fontFamily: FONT_FAMILIES.IBM_PLEX_MONO,
    displayName: 'IBM Plex Mono',
  },
  {
    fontFamily: FONT_FAMILIES.CUTIVE_MONO,
    displayName: 'Cutive Mono',
  },
  {
    fontFamily: FONT_FAMILIES.DANCING_SCRIPT,
    displayName: 'Dancing Script',
  },
  {
    fontFamily: FONT_FAMILIES.MONTSERRAT,
    displayName: 'Montserrat',
  },
];

export const FONT_STYLES: { [key: FontRole]: FontStyle } = {
  default: {
    style: {
      color: TEXT_COLORS.DARK_GREY,
      fontFamily: FONT_FAMILIES.ROBOTO,
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
      fontFamily: FONT_FAMILIES.ROBOTO,
      fontSize: 20,
    },
    modifiers: [
      {
        name: 'lightContent',
        style: {
          color: TEXT_COLORS.WHITE,
        },
      },
    ],
  },
  formLabel: {
    style: {
      color: TEXT_COLORS.LIGHT_GREY,
      fontFamily: FONT_FAMILIES.ROBOTO,
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
      fontFamily: FONT_FAMILIES.ROBOTO,
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
      fontFamily: FONT_FAMILIES.ROBOTO,
      fontSize: 23,
      textAlign: 'center',
    },
  },
  title: {
    style: {
      color: TEXT_COLORS.OFF_WHITE,
      fontFamily: FONT_FAMILIES.SOURCE_SANS_PRO,
      fontSize: 21,
      fontWeight: 'bold',
    },
    modifiers: [
      {
        name: 'darkContent',
        style: {
          color: TEXT_COLORS.DARK_GREY,
        },
      },
    ],
  },
};

export const SCREENS = {
  HOME_SCREEN: `${APP_BUNDLE_ID}.HomeScreen`,
  EDIT_SCREEN: `${APP_BUNDLE_ID}.EditScreen`,
  LOGIN_MODAL: `${APP_BUNDLE_ID}.LoginModal`,
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
          backgroundColor: UI_COLORS.BLACK,
          orientation: APP_ORIENTATIONS,
        },
      },
    },
  },
};
