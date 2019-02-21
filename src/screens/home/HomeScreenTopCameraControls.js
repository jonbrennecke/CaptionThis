// @flow
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import { UI_COLORS } from '../../constants';
import SpeechManager from '../../utils/SpeechManager';
import FlagView from '../../components/localization/FlagView';

import type { Style } from '../../types/react';
import type { LocaleObject } from '../../types/speech';

type Props = {
  style?: ?Style,
};

type State = {
  currentLocale: ?LocaleObject,
  locales: LocaleObject[],
};

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  flag: {},
  currentLocaleFlagWrap: {
    backgroundColor: 'transparent',
    height: 35,
    width: 35,
    borderRadius: 17.5,
    borderWidth: 4,
    borderColor: UI_COLORS.WHITE,
    shadowOpacity: 1,
    shadowColor: UI_COLORS.DARK_GREY,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 2,
  },
  currentLocaleFlag: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 17.5,
  },
  fill: StyleSheet.absoluteFillObject,
};

export default class HomeScreenTopCameraControls extends Component<
  Props,
  State
> {
  state = {
    locales: [],
    currentLocale: null,
  };

  async componentDidMount() {
    const currentLocale = await SpeechManager.currentLocale();
    const locales = await SpeechManager.supportedLocales();
    this.setState({
      locales,
      currentLocale,
    });
  }

  render() {
    const countryCode = this.state.currentLocale?.country.code;
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.currentLocaleFlagWrap}>
          <View style={styles.currentLocaleFlag}>
            {countryCode && <FlagView countryCode={countryCode} style={styles.fill} />}
          </View>
        </View>
        {this.state.locales.map(locale => (
          <View
            key={`${locale.language.code}-${locale.country.code}`}
            style={styles.flag}
          />
        ))}
      </View>
    );
  }
}
