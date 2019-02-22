// @flow
import React, { Component } from 'react';
import { View, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { autobind } from 'core-decorators';

import SpeechManager from '../../utils/SpeechManager';
import FlagList from './FlagList';
import Button from '../../components/button/Button';
import BottomSheetModal from '../../components/bottom-sheet-modal/BottomSheetModal';
import * as Fonts from '../../utils/Fonts';
import { UI_COLORS } from '../../constants';

import type { LocaleObject } from '../../types/speech';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = {
  isVisible: boolean,
  onRequestDismiss: () => void,
  onRequestChangeLocale: (locale: LocaleObject) => void,
};

type State = {
  currentLocale: ?LocaleObject,
  locales: LocaleObject[],
};

const styles = {
  flex: {
    flex: 1,
  },
  fill: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  button: {
    backgroundColor: UI_COLORS.MEDIUM_GREY,
  },
  buttonText: Fonts.getFontStyle('button', { contentStyle: 'lightContent' }),
};

// $FlowFixMe
@autobind
export default class LocaleMenu extends Component<Props, State> {
  state = {
    currentLocale: null,
    locales: [],
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
    return (
      <BottomSheetModal
        isVisible={this.props.isVisible}
        onRequestDismissModal={this.props.onRequestDismiss}
      >
        <View style={styles.fill}>
          <SafeAreaView style={styles.flex}>
            <ScrollView>
              <FlagList
                style={styles.flex}
                locales={this.state.locales}
                currentLocale={this.state.currentLocale}
                onDidSelectLocale={this.props.onRequestChangeLocale}
              />
            </ScrollView>
            <Button
              style={styles.button}
              text="Done"
              onPress={this.props.onRequestDismiss}
            />
          </SafeAreaView>
        </View>
      </BottomSheetModal>
    );
  }
}
