// @flow
/* eslint flowtype/generic-spacing: 0 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
// $FlowFixMe
import SafeArea from 'react-native-safe-area';

import type { ComponentType } from 'react';

export type TranscriptionReviewStateHOCProps = {};

export type TranscriptionReviewStateHOCExtraProps = {
  setSpeechTranscriptionSegmentSelection: (
    ?{ startIndex: number, endIndex: number }
  ) => void,
  setPlaybackTime: (playbackTime: number) => void,
};

export type TranscriptionReviewStateHOCState = {
  bottomSafeAreaInset: ?number,
  playbackTime: number,
  speechTranscriptionSegmentSelection: ?{
    startIndex: number,
    endIndex: number,
  },
};

export function wrapWithTranscriptionReviewState<
  PassThroughProps: Object,
  C: ComponentType<
    TranscriptionReviewStateHOCProps &
      TranscriptionReviewStateHOCExtraProps &
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
      playbackTime: 0,
      speechTranscriptionSegmentSelection: null,
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

    setSpeechTranscriptionSegmentSelection(
      speechTranscriptionSegmentSelection: ?{
        startIndex: number,
        endIndex: number,
      }
    ) {
      this.setState({
        speechTranscriptionSegmentSelection,
      });
    }

    setPlaybackTime(playbackTime: number) {
      this.setState({
        playbackTime,
      });
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          setSpeechTranscriptionSegmentSelection={
            this.setSpeechTranscriptionSegmentSelection
          }
          setPlaybackTime={this.setPlaybackTime}
        />
      );
    }
  }

  const WrappedWithTranscriptionReviewStateHOC = props => (
    <TranscriptionReviewStateHOC {...props} />
  );
  return WrappedWithTranscriptionReviewStateHOC;
}
