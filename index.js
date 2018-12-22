// @flow
import { YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import store from './src/redux/store';
import { registerScreens } from './src/screens';
import * as Screens from './src/utils/Screens';

YellowBox.ignoreWarnings(['Require cycle:']); // NOTE: this hides a warning from the 'core-decorators' package

registerScreens(store, Provider);

Navigation.events().registerAppLaunchedListener(() => {
  Screens.setRoot();
});
