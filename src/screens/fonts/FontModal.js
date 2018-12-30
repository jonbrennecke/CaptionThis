// @flow
import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { BlurView } from 'react-native-blur';

import FontModalNavControls from './FontModalNavControls';
import { UI_COLORS, FONTS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import * as Color from '../../utils/Color';
import * as Screens from '../../utils/Screens';
import { receiveUserSelectedFontFamily } from '../../redux/media/actionCreators';

import type { Dispatch } from '../../types/redux';

type OwnProps = {};

type StateProps = {};

type DispatchProps = {
  receiveUserSelectedFontFamily: (fontFamily: string) => Promise<void>,
};

type Props = OwnProps & StateProps & DispatchProps;

const FONT_EXAMPLE_TEXT = 'The quick brown fox jumps over the lazy dog';

const styles = {
  container: {
    flex: 1,
    backgroundColor: Color.hexToRgbaString(UI_COLORS.DARK_GREY, 0.25),
    paddingHorizontal: 15,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  flex: {
    flex: 1,
  },
  title: Fonts.getFontStyle('title', { contentStyle: 'lightContent' }),
  fonts: {
    flex: 1,
    alignItems: 'flex-start',
  },
  font: {
    paddingVertical: 15,
    alignItems: 'flex-start',
  },
  fontFamilyText: Fonts.getFontStyle('formLabel', {
    contentStyle: 'lightContent',
  }),
  fontExampleText: {
    ...Fonts.getFontStyle('button', {
      contentStyle: 'lightContent',
      size: 'large',
    }),
    marginBottom: 5,
  },
};

function mapStateToProps(): StateProps {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    receiveUserSelectedFontFamily: (fontFamily: string) =>
      dispatch(receiveUserSelectedFontFamily(fontFamily)),
  };
}

// $FlowFixMe
@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class FontModal extends Component<Props> {
  onBackButtonPress() {
    Screens.dismissFontModal();
  }

  onSelectFont(fontFamily: string) {
    this.props.receiveUserSelectedFontFamily(fontFamily);
    Screens.dismissFontModal();
  }

  render() {
    return (
      <View style={styles.container}>
        <BlurView style={styles.blurView} blurType="dark" />
        <SafeAreaView style={styles.flex}>
          <ScrollView
            style={styles.flex}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            contentInsetAdjustmentBehavior="automatic"
            overScrollMode="always"
            alwaysBounceVertical
          >
            <FontModalNavControls onBackButtonPress={this.onBackButtonPress} />
            <Text style={styles.title}>FONT</Text>
            <View style={styles.fonts}>
              {FONTS.map(({ displayName, fontFamily }) => (
                <TouchableOpacity
                  onPress={() => this.onSelectFont(fontFamily)}
                  style={styles.font}
                  key={fontFamily}
                >
                  <Text
                    numberOfLines={1}
                    style={[styles.fontExampleText, { fontFamily }]}
                  >
                    {FONT_EXAMPLE_TEXT}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[styles.fontFamilyText, { fontFamily }]}
                  >
                    {displayName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
