// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import LoginForm from '../../components/forms/login-form/LoginForm';
import { UI_COLORS } from '../../constants';

type OwnProps = {};

type StateProps = {};

type DispatchProps = {};

type Props = OwnProps & StateProps & DispatchProps;

type State = {
  email: ?string,
  password: ?string,
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.OFF_WHITE,
    padding: 20,
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
class LoginModal extends Component<Props, State> {
  state: State = {
    email: null,
    password: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <LoginForm
          email={this.state.email}
          onShouldChangeEmail={email => this.setState({ email })}
          password={this.state.password}
          onShouldChangePassword={password => this.setState({ password })}
          onShouldSubmit={() => {
            // TODO
          }}
        />
      </View>
    );
  }
}

export default LoginModal;
