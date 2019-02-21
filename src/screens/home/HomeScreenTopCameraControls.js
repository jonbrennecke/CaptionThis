// @flow
import React, { Component } from 'react';
import { View } from 'react-native';

import SpeechManager from '../../utils/SpeechManager';

import type { Style } from '../../types/react';
import type { LocaleObject } from '../../types/speech';

type Props = {
  style?: ?Style,
};

type State = {
  // currentLocale: LocaleObject[],
  locales: LocaleObject[],
};

const styles = {
  container: {
    
  },
  flag: {

  }
};

export default class HomeScreenTopCameraControls extends Component<Props, State> {
  state = {
    locales: [],
  };

  async componentDidMount() {
    // const currentLocale = await SpeechManager.currentLocale();
    const locales = await SpeechManager.supportedLocales();
    this.setState({
      locales,
    });
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.state.locales.map(locale => (
          <View key={`${locale.language.code}-${locale.country.code}`} style={styles.flag}>
          </View>
        ))}
      </View>
    );
  }
}