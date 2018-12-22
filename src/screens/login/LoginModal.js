// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import * as Validate from '../../utils/Validate';
import LoginForm from '../../components/forms/login-form/LoginForm';
import { UI_COLORS } from '../../constants';
import { login } from '../../redux/auth/actionCreators';

import type { Dispatch } from '../../types/redux';

type OwnProps = {};

type StateProps = {};

type DispatchProps = {
  login: (email: string, password: string) => Promise<void>,
};

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

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    login: (email: string, password: string) =>
      dispatch(login(email, password)),
  };
}

// $FlowFixMe
@connect(mapStateToProps, mapDispatchToProps)
@autobind
class LoginModal extends Component<Props, State> {
  state: State = {
    email: null,
    password: null,
  };

  async validateAndSubmitLogin() {
    const { email, password } = this.state;
    if (!email || !password) {
      return;
    }
    if (!Validate.isValidEmail(email) || !Validate.isValidPassword(password)) {
      return;
    }
    await this.props.login(email, password);
  }

  render() {
    return (
      <View style={styles.container}>
        <LoginForm
          email={this.state.email}
          onShouldChangeEmail={email => this.setState({ email })}
          password={this.state.password}
          onShouldChangePassword={password => this.setState({ password })}
          onShouldSubmit={() => { this.validateAndSubmitLogin(); }}
        />
      </View>
    );
  }
}

export default LoginModal;
