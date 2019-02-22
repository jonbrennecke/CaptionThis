// @flow
import { YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { Sentry } from 'react-native-sentry';

import createStore from './src/redux/store';
import { registerScreens } from './src/screens';
import * as Screens from './src/utils/Screens';

YellowBox.ignoreWarnings([
  'Require cycle:', // NOTE: this hides a warning from the 'core-decorators' package
  'Remote debugger is in a background tab',
]);

Sentry.config('https://d80580c400724fd3bf4a1feece1bbcf5@sentry.io/1400787').install();

const store = createStore();
registerScreens(store, Provider);

Navigation.events().registerAppLaunchedListener(() => {
  Screens.setRoot();
});
