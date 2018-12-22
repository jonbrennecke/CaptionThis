// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { UI_COLORS } from '../../constants';

type OwnProps = {
  navigator: Navigator,
};

type StateProps = {};

type DispatchProps = {};

type Props = OwnProps & StateProps & DispatchProps;

type State = {};

const styles = {
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.OFF_WHITE,
  },
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
export default class LoginModal extends Component<Props, State> {
  state: State = {};

  render() {
    return <View style={styles.container} />;
  }
}
