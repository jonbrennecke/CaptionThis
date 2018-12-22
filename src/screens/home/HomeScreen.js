// @flow
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { UI_COLORS } from '../../constants';
import { isLoggedIn } from '../../redux/auth/selectors';
import { loadAuth } from '../../redux/auth/actionCreators';
import * as Screens from '../../utils/Screens';
import * as Fonts from '../../utils/Fonts';

import type { Dispatch, AppState } from '../../types/redux';

type OwnProps = {
  navigator: Navigator,
};

type StateProps = {
  isLoggedIn: boolean,
};

type DispatchProps = {
  loadAuth: () => Promise<any>,
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

function mapStateToProps(state: AppState): StateProps {
  return {
    isLoggedIn: isLoggedIn(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    loadAuth: () => dispatch(loadAuth()),
  };
}

// $FlowFixMe
@connect(mapStateToProps, mapDispatchToProps)
@autobind
class HomeScreen extends Component<Props> {
  async componentDidMount() {
    if (!this.props.isLoggedIn) {
      await Screens.showLoginModal();
    }
    await this.props.loadAuth();
  }

  async componentDidUpdate(prevProps: Props) {
    if (this.props.isLoggedIn && !prevProps.isLoggedIn) {
      await Screens.dismissLoginModal();
    } else if (!this.props.isLoggedIn && prevProps.isLoggedIn) {
      await Screens.showLoginModal();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome back!</Text>
      </View>
    );
  }
}

export default HomeScreen;
