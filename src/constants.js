// @flow
import { Platform } from 'react-native';

export const APP_BUNDLE_ID = 'com.jonbrennecke.loginApp'; // TODO use DeviceInfo

export const API_BASE_URL = 'https://reqres.in/api';

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
};

export const FONTS = {
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

export const SCREENS = {
  HOME_SCREEN: `${APP_BUNDLE_ID}.HomeScreen`,
  LOGIN_MODAL: `${APP_BUNDLE_ID}.LoginModal`,
};

export const SCREEN_STYLES = {
  NAVBAR: {
    navBarBackgroundColor: UI_COLORS.WHITE,
    navBarTextColor: TEXT_COLORS.DARK_GREY,
    navBarTextFontSize: 22,
    navBarTextFontFamily: FONTS.PT_SANS_REGULAR,
    navBarTitleTextCentered: true,
    navBarHeight: 70,
    navBarButtonColor: UI_COLORS.DARK_GREY,
    statusBarTextColorScheme: 'light',
  },
};

export const SINGLE_SCREEN_NAVIGATOR_PARAMS = {
  screen: {
    screen: 'loginapp.HomeScreen',
    title: 'Home',
    navigatorStyle: {
      navBarHidden: true,
      ...SCREEN_STYLES.NAVBAR,
    },
    navigatorButtons: {},
  },
  appStyle: {
    orientation: 'portrait',
    keepStyleAcrossPush: false,
  },
};
