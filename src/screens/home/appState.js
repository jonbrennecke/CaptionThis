// @flow
/* eslint flowtype/generic-spacing: 0 */
import React, { PureComponent } from 'react';
import { AppState } from 'react-native';
import { autobind } from 'core-decorators';

import type { ComponentType } from 'react';

export type AppStateHOCProps = {
  appState: typeof AppState.currentState,
};

export type AppStateOwnProps = {};

export type AppStateProviderState = {
  appState: typeof AppState.currentState,
};

export function wrapWithAppState<
  PassThroughProps: Object,
  C: ComponentType<AppStateHOCProps & PassThroughProps>
>(WrappedComponent: C): ComponentType<AppStateOwnProps & PassThroughProps> {
  // $FlowFixMe
  @autobind
  class AppStateProvider extends PureComponent<
    AppStateOwnProps & PassThroughProps,
    AppStateProviderState
  > {
    state: $Exact<AppStateProviderState> = {
      appState: null,
    };

    async componentDidMount() {
      AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
      AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange(nextAppState: typeof AppState.currentState) {
      this.setState({
        appState: nextAppState,
      });
    }

    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  }

  // eslint-disable-next-line react/display-name
  return props => <AppStateProvider {...props} />;
}
