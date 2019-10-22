// @flow
import { AppRegistry, YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { Sentry } from 'react-native-sentry';
import Bluebird from 'bluebird';
import { name as appName } from './app.json';

import createStore from './src/redux/store';
import { createScreens } from './src/screens';

YellowBox.ignoreWarnings([
  'Require cycle:', // NOTE: this hides a warning from the 'core-decorators' package
  'Remote debugger is in a background tab',
]);

Bluebird.config({
  cancellation: true,
});

Sentry.config('https://d80580c400724fd3bf4a1feece1bbcf5@sentry.io/1400787').install();

const store = createStore();

AppRegistry.registerComponent(appName, () => createScreens(store, Provider));
