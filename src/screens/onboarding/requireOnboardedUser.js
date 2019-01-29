// @flow
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { arePermissionsGranted } from '../../redux/onboarding/selectors';
import { loadAppPermissions } from '../../redux/onboarding/actionCreators';
import FadeInOutAnimatedView from '../../components/animations/FadeInOutAnimatedView';
import Onboarding from './Onboarding';

import type { Dispatch, AppState } from '../../types/redux';

type OwnProps = {};

type StateProps = {
  arePermissionsGranted: boolean,
};

type DispatchProps = {
  loadAppPermissions: () => Promise<any>,
};

type Props = OwnProps & StateProps & DispatchProps;

type State = {
  isOnboardingVisible: boolean,
};

function mapStateToProps(state: AppState): StateProps {
  return {
    arePermissionsGranted: arePermissionsGranted(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<*>): DispatchProps {
  return {
    loadAppPermissions: () => dispatch(loadAppPermissions()),
  };
}

const styles = {
  absoluteFill: StyleSheet.absoluteFillObject,
};

export default function requireOnboardedUser<P, S>(
  WrappedComponent: Class<Component<P & Props, S>>
): Class<Component<P, S>> {
  // $FlowFixMe
  @autobind
  class RequireOnboardedUser extends Component<Props, State> {
    state = {
      isOnboardingVisible: true,
    };

    async componentDidMount() {
      if (!this.props.arePermissionsGranted) {
        this.setState({
          isOnboardingVisible: true,
        });
      }
      await this.props.loadAppPermissions();
    }

    async componentDidUpdate(prevProps: Props) {
      if (
        !this.props.arePermissionsGranted &&
        prevProps.arePermissionsGranted
      ) {
        this.setState({
          isOnboardingVisible: true,
        });
      }
    }

    userDidCompleteOnboarding() {
      this.setState({
        isOnboardingVisible: false,
      });
    }

    render() {
      return (
        <View style={styles.absoluteFill}>
          {/* $FlowFixMe */}
          <WrappedComponent {...this.props} />
          <FadeInOutAnimatedView
            style={styles.absoluteFill}
            isVisible={this.state.isOnboardingVisible}
          >
            {/* $FlowFixMe */}
            <Onboarding
              onUserDidCompleteOnboarding={this.userDidCompleteOnboarding}
            />
          </FadeInOutAnimatedView>
        </View>
      );
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(RequireOnboardedUser);
}
