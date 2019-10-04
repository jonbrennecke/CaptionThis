// @flow
/* eslint flowtype/generic-spacing: 0 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';

import type { ComponentType } from 'react';

export type TranscriptionReviewStateHOCProps = {};

export type TranscriptionReviewStateHOCState = {};

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
    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  }

  const WrappedWithTranscriptionReviewStateHOC = props => (
    <TranscriptionReviewStateHOC {...props} />
  );
  return WrappedWithTranscriptionReviewStateHOC;
}
