// @flow
import { createElement, Component } from 'react';
import { connect } from 'react-redux';

import { isLoggedIn } from '../redux/auth/selectors';
import { loadAuth } from '../redux/auth/actionCreators';
import * as Screens from '../utils/Screens';

import type { Dispatch, AppState } from '../types/redux';

type OwnProps = {};

type StateProps = {
  isLoggedIn: boolean,
};

type DispatchProps = {
  loadAuth: () => Promise<any>,
};

type Props = OwnProps & StateProps & DispatchProps;

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

export function requireOnboardedUser<P, S>(
  WrappedComponent: Class<Component<P & Props, S>>
): Class<Component<P, S>> {
  class RequireAuth extends Component<Props> {
    async componentDidMount() {
      if (!this.props.isLoggedIn) {
        await Screens.showOnboardingModal();
      }
      await this.props.loadAuth();
    }

    async componentDidUpdate(prevProps: Props) {
      if (this.props.isLoggedIn && !prevProps.isLoggedIn) {
        await Screens.dismissOnboardingModal();
      } else if (!this.props.isLoggedIn && prevProps.isLoggedIn) {
        await Screens.showOnboardingModal();
      }
    }

    render() {
      // $FlowFixMe
      return createElement(WrappedComponent, this.props);
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(RequireAuth);
}
