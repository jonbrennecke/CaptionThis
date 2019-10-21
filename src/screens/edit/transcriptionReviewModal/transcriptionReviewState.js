// @flow
/* eslint flowtype/generic-spacing: 0 */
import React, { PureComponent, createRef } from 'react';
import { autobind } from 'core-decorators';
// $FlowFixMe
import SafeArea from 'react-native-safe-area';
import throttle from 'lodash/throttle';
import isEqual from 'lodash/isEqual';
import { Navigation } from 'react-native-navigation';

import * as Screens from '../../../utils/Screens';
import { createSpeechStateHOC } from '@jonbrennecke/react-native-speech';

import type { ComponentType } from 'react';
import typeof { VideoPlayer } from '@jonbrennecke/react-native-media';
import type { PlaybackState } from '@jonbrennecke/react-native-camera';
import type { SpeechStateHOCProps } from '@jonbrennecke/react-native-speech';

import type { Return } from '../../../types';

export type TranscriptionReviewStateHOCProps = {};

export type TranscriptionReviewStateHOCExtraProps = {
  videoPlayerRef: Return<createRef<VideoPlayer>>,
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

export function wrapWithTranscriptionReviewState<
  PassThroughProps: Object,
  C: ComponentType<
    TranscriptionReviewStateHOCProps &
      TranscriptionReviewStateHOCExtraProps &
      TranscriptionReviewStateHOCState &
      SpeechStateHOCProps &
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
    videoPlayerRef = createRef();
    state: $Exact<TranscriptionReviewStateHOCState> = {
      bottomSafeAreaInset: null,
      playbackTime: 0,
      playbackState: 'waiting',
      speechTranscriptionSegmentSelection: null,
      componentIsVisible: false,
    };
    navigationEventListener: any;

    componentDidMount() {
      SafeArea.addEventListener(
        'safeAreaInsetsForRootViewDidChange',
        this.safeAreaInsetsForRootViewDidChange
      );
      this.navigationEventListener = Navigation.events().bindComponent(this);
    }

    componentWillUnmount() {
      SafeArea.removeEventListener(
        'safeAreaInsetsForRootViewDidChange',
        this.safeAreaInsetsForRootViewDidChange
      );
      if (this.navigationEventListener) {
        this.navigationEventListener.remove();
      }
    }

    /// MARK - navigation events

    componentDidAppear() {
      this.setState({
        componentIsVisible: true,
      });
    }

    componentDidDisappear() {
      this.setState({
        componentIsVisible: false,
      });
    }

    async dismissScreen() {
      this.setState(
        {
          componentIsVisible: false,
        },
        () => {
          setTimeout(async () => {
            await Screens.dismissTranscriptionReviewScreen();
          }, 300);
        }
      );
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
