// @flow
import React, { Component } from 'react';
import { View, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { autobind } from 'core-decorators';

import * as Color from '../../utils/Color';
import { UI_COLORS } from '../../constants';
import ScreenGradients from '../../components/screen-gradients/ScreenGradients';
import SpeechManager from '../../utils/SpeechManager';
import FlagList from './FlagList';
import Button from '../../components/button/Button';
import BottomSheetModal from '../../components/bottom-sheet-modal/BottomSheetModal';
import * as Fonts from '../../utils/Fonts';

import type { LocaleObject } from '../../types/speech';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = {
  isVisible: boolean,
  locale: ?LocaleObject,
  onRequestDismiss: () => void,
  onRequestChangeLocale: (locale: LocaleObject) => void,
};

type State = {
  locales: LocaleObject[],
};

const styles = {
  flex: {
    flex: 1,
  },
  fill: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: Color.hexToRgbaString(UI_COLORS.DARK_GREY, 0.5),
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
    locales: [],
  };

  async componentDidMount() {
    const locales = await SpeechManager.supportedLocales();
    this.setState({
      locales,
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
                currentLocale={this.props.locale}
                onDidSelectLocale={this.props.onRequestChangeLocale}
              />
            </ScrollView>
            <ScreenGradients colorHex={UI_COLORS.DARK_GREY} startOpacity={1} />
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
