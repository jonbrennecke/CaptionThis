// @flow
import { createElement, Component } from 'react';
import { connect } from 'react-redux';

import { arePermissionsGranted } from '../redux/onboarding/selectors';
import { loadAppPermissions } from '../redux/onboarding/actionCreators';
import * as Screens from '../utils/Screens';

import type { Dispatch, AppState } from '../types/redux';

type OwnProps = {};

type StateProps = {
  arePermissionsGranted: boolean,
};

type DispatchProps = {
  loadAppPermissions: () => Promise<any>,
};

type Props = OwnProps & StateProps & DispatchProps;

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

export function requireOnboardedUser<P, S>(
  WrappedComponent: Class<Component<P & Props, S>>
): Class<Component<P, S>> {
  class RequireOnboardedUser extends Component<Props> {
    async componentDidMount() {
      if (!this.props.arePermissionsGranted) {
        await Screens.showOnboardingModal();
      }
      await this.props.loadAppPermissions();
    }

    async componentDidUpdate(prevProps: Props) {
      if (
        this.props.arePermissionsGranted &&
        !prevProps.arePermissionsGranted
      ) {
        await Screens.dismissOnboardingModal();
      } else if (
        !this.props.arePermissionsGranted &&
        prevProps.arePermissionsGranted
      ) {
        await Screens.showOnboardingModal();
      }
    }

    render() {
      // $FlowFixMe
      return createElement(WrappedComponent, this.props);
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(RequireOnboardedUser);
}
