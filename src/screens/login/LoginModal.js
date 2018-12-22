// @flow
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { UI_COLORS } from '../../constants';

type OwnProps = {};

type StateProps = {};

type DispatchProps = {};

type Props = OwnProps & StateProps & DispatchProps;

const styles = {
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.OFF_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
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
class LoginModal extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text>Login Modal</Text>
      </View>
    );
  }
}

export default LoginModal;
