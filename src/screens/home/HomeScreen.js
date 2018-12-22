// @flow
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { UI_COLORS } from '../../constants';
import { isLoggedIn } from '../../redux/auth/selectors';
import { loadAuth } from '../../redux/auth/actionCreators';
import * as Screens from '../../utils/Screens';

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
      Screens.showLoginModal();
    }
    await this.props.loadAuth();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.isLoggedIn && !prevProps.isLoggedIn) {
      // TODO dismiss loginModal
      // this.setState({
      //   showLoginModal: false,
      // });
    } else if (!this.props.isLoggedIn && prevProps.isLoggedIn) {
      Screens.showLoginModal();
      // this.setState({
      //   showLoginModal: true,
      // });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Home Screen</Text>
      </View>
    );
  }
}

export default HomeScreen;
