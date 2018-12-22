// @flow
import { YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import store from './src/redux/store';
import { registerScreens } from './src/screens';
import { SCREENS } from './src/constants';

YellowBox.ignoreWarnings(['Require cycle:']); // TODO: this hides a warning from the 'core-decorators' package

registerScreens(store, Provider);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: SCREENS.HOME_SCREEN,
      }
    }
  });
});
