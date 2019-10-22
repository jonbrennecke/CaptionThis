// @flow
import React, { PureComponent } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { arePermissionsGranted } from '../../redux/onboarding/selectors';
import { loadAppPermissions } from '../../redux/onboarding/actionCreators';
import FadeInOutAnimatedView from '../../components/animations/FadeInOutAnimatedView';
import Onboarding from './Onboarding';

import type { ComponentType } from 'react';

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
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
};

export default function requireOnboardedUser<
  ComponentOwnProps: Object,
  C: ComponentType<Props & ComponentOwnProps>
>(WrappedComponent: C): ComponentType<ComponentOwnProps> {
  // $FlowFixMe
  @autobind
  class RequireOnboardedUser extends PureComponent<
    ComponentOwnProps & Props,
    State
  > {
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
      const wrappedElement = !this.state.isOnboardingVisible && (
        // $FlowFixMe
        <WrappedComponent {...this.props} {...this.state} />
      );
      return (
        <View style={styles.container}>
          <StatusBar barStyle="light-content"/>
          {wrappedElement}
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
