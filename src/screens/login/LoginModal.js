// @flow
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import * as Validate from '../../utils/Validate';
import * as Fonts from '../../utils/Fonts';
import { hexToRgbaString } from '../../utils/Color';
import LoginForm from '../../components/forms/login-form/LoginForm';
import { UI_COLORS } from '../../constants';
import { login } from '../../redux/auth/actionCreators';
import { isLoadingAuth } from '../../redux/auth/selectors';

import type { AppState, Dispatch } from '../../types/redux';

type OwnProps = {};

type StateProps = {
  isLoadingAuth: boolean,
};

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
  loadingOverlay: (isLoadingAuth: boolean) => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: isLoadingAuth
      ? hexToRgbaString(UI_COLORS.DARK_GREY, 0.5)
      : 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  }),
  text: Fonts.getFontStyle('heading', { contentStyle: 'light-content' }),
};

function mapStateToProps(state: AppState): StateProps {
  return {
    isLoadingAuth: isLoadingAuth(state),
  };
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
export default class LoginModal extends Component<Props, State> {
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
          onShouldSubmit={() => {
            this.validateAndSubmitLogin();
          }}
        />
        <View
          style={styles.loadingOverlay(this.props.isLoadingAuth)}
          pointerEvents="none"
        >
          <Text style={styles.text}>Loading...</Text>
        </View>
      </View>
    );
  }
}
