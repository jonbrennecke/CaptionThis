// @flow
import React, { Component } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { BlurView } from 'react-native-blur';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import * as Color from '../../utils/Color';

type OwnProps = {};

type StateProps = {};

type DispatchProps = {};

type Props = OwnProps & StateProps & DispatchProps;

const styles = {
  container: {
    flex: 1,
    backgroundColor: Color.hexToRgbaString(UI_COLORS.DARK_GREY, 0.25),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 65,
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
};

function mapStateToProps(): StateProps {
  return {};
}

function mapDispatchToProps(): DispatchProps {
  return {};
}

// $FlowFixMe
@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class FontModal extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <BlurView style={styles.blurView} blurType="dark" />
        <SafeAreaView style={styles.flex}>
          <Text style={styles.title}>FONT</Text>
        </SafeAreaView>
      </View>
    );
  }
}
