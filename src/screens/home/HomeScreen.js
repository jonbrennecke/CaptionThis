// @flow
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import { requireAuth } from '../../utils/Auth';

type OwnProps = {
};

type StateProps = {
};

type DispatchProps = {
};

type Props = OwnProps & StateProps & DispatchProps;

const styles = {
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.OFF_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: Fonts.getFontStyle('heading'),
};

function mapStateToProps(): StateProps {
  return {};
}

function mapDispatchToProps(): DispatchProps {
  return {};
}

// $FlowFixMe
@requireAuth
@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class HomeScreen extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome back!</Text>
      </View>
    );
  }
}