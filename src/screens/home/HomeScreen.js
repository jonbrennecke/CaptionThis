// @flow
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { UI_COLORS } from '../../constants';
import { isLoggedIn } from '../../redux/auth/selectors';
import { loadAuth } from '../../redux/auth/actionCreators';

import type { Dispatch, AppState } from '../../types';

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

type State = {};

const styles = {
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.OFF_WHITE,
  },
};

function mapStateToProps(state: AppState): StateProps {
  return {
    isLoggedIn: isLoggedIn(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    loadAuth: () => dispatch(loadAuth()),
  };
}

// $FlowFixMe
@connect(mapStateToProps, mapDispatchToProps)
@autobind
class HomeScreen extends Component<Props, State> {
  state: State = {};

  async componentDidMount() {
    await this.props.loadAuth();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hello</Text>
      </View>
    );
  }
}

export default HomeScreen;
