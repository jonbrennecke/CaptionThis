// @flow
/* eslint flowtype/generic-spacing: 0 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
// $FlowFixMe
import SafeArea from 'react-native-safe-area';

import type { ComponentType } from 'react';

export type TranscriptionReviewStateHOCProps = {};

export type TranscriptionReviewStateHOCState = {
  bottomSafeAreaInset: ?number,
};

export function wrapWithTranscriptionReviewState<
  PassThroughProps: Object,
  C: ComponentType<
    TranscriptionReviewStateHOCProps &
      TranscriptionReviewStateHOCState &
      PassThroughProps
  >
>(
  WrappedComponent: C
): ComponentType<TranscriptionReviewStateHOCProps & PassThroughProps> {
  // $FlowFixMe
  @autobind
  class TranscriptionReviewStateHOC extends PureComponent<
    TranscriptionReviewStateHOCProps & PassThroughProps,
    TranscriptionReviewStateHOCState
  > {
    state: $Exact<TranscriptionReviewStateHOCState> = {
      bottomSafeAreaInset: null,
    };

    componentDidMount() {
      SafeArea.addEventListener(
        'safeAreaInsetsForRootViewDidChange',
        this.safeAreaInsetsForRootViewDidChange
      );
    }

    componentWillUnmount() {
      SafeArea.removeEventListener(
        'safeAreaInsetsForRootViewDidChange',
        this.safeAreaInsetsForRootViewDidChange
      );
    }

    safeAreaInsetsForRootViewDidChange({ safeAreaInsets: insets }: any) {
      this.setState({
        bottomSafeAreaInset: insets.bottom,
      });
    }

    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  }

  const WrappedWithTranscriptionReviewStateHOC = props => (
    <TranscriptionReviewStateHOC {...props} />
  );
  return WrappedWithTranscriptionReviewStateHOC;
}
