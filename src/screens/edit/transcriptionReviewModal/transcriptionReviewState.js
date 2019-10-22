// @flow
/* eslint flowtype/generic-spacing: 0 */
import React, { PureComponent, createRef } from 'react';
import BluebirdPromise from 'bluebird';
import { autobind } from 'core-decorators';
// $FlowFixMe
import SafeArea from 'react-native-safe-area';
import throttle from 'lodash/throttle';
import isEqual from 'lodash/isEqual';

import { createSpeechStateHOC } from '@jonbrennecke/react-native-speech';

import type { ComponentType } from 'react';
import type {
  // eslint-disable-next-line import/named
  NavigationScreenProp,
  // eslint-disable-next-line import/named
  NavigationEventSubscription,
} from 'react-navigation';
import type {
  VideoPlayer,
  MediaObject,
} from '@jonbrennecke/react-native-media';
import type { PlaybackState } from '@jonbrennecke/react-native-camera';
import type { SpeechStateHOCProps } from '@jonbrennecke/react-native-speech';

type TranscriptionReviewStateHOCOwnProps = {
  navigation: NavigationScreenProp<{
    params: {
      video: MediaObject,
    },
  }>,
};

type TranscriptionReviewStateHOCExtraProps = {
  videoPlayerRef: { current: VideoPlayer | null },
  playVideo: () => void,
  pauseVideo: () => void,
  restartVideo: () => void,
  seekVideoToTime: (time: number) => void,
  setSpeechTranscriptionSegmentSelection: (
    ?{ startIndex: number, endIndex: number }
  ) => void,
  setPlaybackTime: (playbackTime: number) => void,
  setPlaybackState: (playbackState: PlaybackState) => void,
  dismissScreen: () => void,
};

export type TranscriptionReviewStateHOCState = {
  bottomSafeAreaInset: ?number,
  playbackTime: number,
  playbackState: PlaybackState,
  speechTranscriptionSegmentSelection: ?{
    startIndex: number,
    endIndex: number,
  },
  componentIsVisible: boolean,
};

export type TranscriptionReviewStateHOCProps = TranscriptionReviewStateHOCOwnProps &
  TranscriptionReviewStateHOCExtraProps &
  TranscriptionReviewStateHOCState &
  SpeechStateHOCProps;

export function wrapWithTranscriptionReviewState<
  PassThroughProps: Object,
  C: ComponentType<TranscriptionReviewStateHOCProps & PassThroughProps>
>(WrappedComponent: C): ComponentType<PassThroughProps> {
  // $FlowFixMe
  @autobind
  class TranscriptionReviewStateHOC extends PureComponent<
    TranscriptionReviewStateHOCProps & PassThroughProps,
    TranscriptionReviewStateHOCState
  > {
    videoPlayerRef = createRef();
    state: $Exact<TranscriptionReviewStateHOCState> = {
      bottomSafeAreaInset: null,
      playbackTime: 0,
      playbackState: 'waiting',
      speechTranscriptionSegmentSelection: null,
      componentIsVisible: false,
    };
    dismissScreenPromise: ?BluebirdPromise;
    willBlurSubscription: ?NavigationEventSubscription;
    didFocusSubscription: ?NavigationEventSubscription;

    async componentDidMount() {
      this.didFocusSubscription = this.props.navigation.addListener(
        'didFocus',
        this.componentDidFocus
      );
      this.willBlurSubscription = this.props.navigation.addListener(
        'willBlur',
        this.componentWillBlur
      );
      SafeArea.addEventListener(
        'safeAreaInsetsForRootViewDidChange',
        this.safeAreaInsetsForRootViewDidChange
      );
      SafeArea.getSafeAreaInsetsForRootView()
        .then(({ safeAreaInsets: insets }) => {
          this.setState({
            bottomSafeAreaInset: insets.bottom,
          });
        });
    }

    componentWillUnmount() {
      SafeArea.removeEventListener(
        'safeAreaInsetsForRootViewDidChange',
        this.safeAreaInsetsForRootViewDidChange
      );
      if (this.didFocusSubscription) {
        this.didFocusSubscription.remove();
        this.didFocusSubscription = null;
      }
      if (this.willBlurSubscription) {
        this.willBlurSubscription.remove();
        this.willBlurSubscription = null;
      }
      if (this.dismissScreenPromise) {
        this.dismissScreenPromise.cancel();
        this.dismissScreenPromise = null;
      }
    }

    /// MARK - navigation events

    componentDidFocus() {
      this.setState({
        componentIsVisible: true,
      });
    }

    componentWillBlur() {
      this.setState({
        componentIsVisible: false,
      });
    }

    async dismissScreen() {
      this.dismissScreenPromise = new BluebirdPromise(resolve => {
        this.setState(
          {
            componentIsVisible: false,
          },
          async () => {
            this.props.navigation.goBack();
            resolve();
          }
        );
      });
    }

    /// MARK - safe area events

    safeAreaInsetsForRootViewDidChange({ safeAreaInsets: insets }: any) {
      this.setState({
        bottomSafeAreaInset: insets.bottom,
      });
    }

    /// MARK - segment selection controls

    setSpeechTranscriptionSegmentSelectionThrottled = throttle(
      this.setSpeechTranscriptionSegmentSelection,
      1000 / 60
    );

    setSpeechTranscriptionSegmentSelection(
      selection: ?{
        startIndex: number,
        endIndex: number,
      }
    ) {
      if (
        selection &&
        selection.startIndex >= 0 &&
        !isEqual(selection, this.state.speechTranscriptionSegmentSelection)
      ) {
        this.setState({
          speechTranscriptionSegmentSelection: selection,
        });
      }
    }

    /// MARK - playback controls

    setPlaybackTimeThrottled = throttle(this.setPlaybackTime, 1000 / 60, {
      leading: true,
    });

    setPlaybackTime(playbackTime: number) {
      this.setState({
        playbackTime,
      });
    }

    setPlaybackState(playbackState: PlaybackState) {
      this.setState({
        playbackState,
      });
    }

    playVideo() {
      if (!this.videoPlayerRef.current) {
        return;
      }
      this.videoPlayerRef.current.play();
    }

    pauseVideo() {
      if (!this.videoPlayerRef.current) {
        return;
      }
      this.videoPlayerRef.current.pause();
    }

    restartVideo() {
      if (!this.videoPlayerRef.current) {
        return;
      }
      this.videoPlayerRef.current.restart();
    }

    seekVideoToTime(time: number) {
      if (!this.videoPlayerRef.current) {
        return;
      }
      this.videoPlayerRef.current.seekToTime(time);
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          videoPlayerRef={this.videoPlayerRef}
          playVideo={this.playVideo}
          pauseVideo={this.pauseVideo}
          restartVideo={this.restartVideo}
          seekVideoToTime={this.seekVideoToTime}
          setSpeechTranscriptionSegmentSelection={
            this.setSpeechTranscriptionSegmentSelectionThrottled
          }
          setPlaybackTime={this.setPlaybackTimeThrottled}
          setPlaybackState={this.setPlaybackState}
          dismissScreen={this.dismissScreen}
        />
      );
    }
  }

  const wrapWithSpeechState = createSpeechStateHOC(state => state.speech);
  const Component = wrapWithSpeechState(TranscriptionReviewStateHOC);
  const WrappedWithTranscriptionReviewStateHOC = props => (
    <Component {...props} />
  );
  return WrappedWithTranscriptionReviewStateHOC;
}
