// @flow
import React from 'react';
import { StatusBar, View, StyleSheet, ScrollView } from 'react-native';
// $FlowFixMe
import { withSafeArea } from 'react-native-safe-area';
import ReactNativeHaptic from 'react-native-haptic';

import * as Screens from '../../../utils/Screens';
import KeyboardAvoidingView from '../../../components/keyboard-avoiding-view/KeyboardAvoidingView';
import { wrapWithTranscriptionReviewState } from './transcriptionReviewState';
import { TranscriptionTextInput } from './TranscriptionTextInput';
import { PlaybackSlider } from './PlaybackSlider';
import { FloatingVideoPlayer, MeasureContentsView } from '../../../components';
import { DoneButton } from './DoneButton';
import { RewindButton } from './RewindButton';
import { FastForwardButton } from './FastForwardButton';
import { Units, Colors } from '../../../constants';
import {
  interpolateSegments,
  findIndexOfSegmentAtPlaybackTime,
} from './transcriptionReviewUtils';
import { PlayButton } from './PlayButton';

import type { ComponentType } from 'react';
import type { MediaObject } from '@jonbrennecke/react-native-media';

import type { SpeechTranscription } from '../../../types';

export type TranscriptionReviewModalProps = {
  componentId: string,
  video: MediaObject,
  speechTranscription: ?SpeechTranscription,
  onSpeechTranscriptionChange: SpeechTranscription => void,
};

function hapticFeedback() {
  ReactNativeHaptic.generate('selection');
}

const SafeAreaView = withSafeArea(View, 'padding', 'vertical');

const styles = {
  flex: {
    flex: 1,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.solid.white,
  },
  transcriptionContainer: {
    flex: 1,
    backgroundColor: Colors.solid.extraLightGray,
  },
  scrollViewContents: {
    paddingVertical: Units.extraLarge,
    paddingHorizontal: Units.extraLarge,
  },
  playbackControlsContainer: {
    zIndex: 1000,
  },
  navigationControlsContainer: {
    paddingVertical: Units.small,
    paddingHorizontal: Units.small,
  },
  playbackControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Units.extraSmall,
    paddingBottom: Units.small,
    paddingHorizontal: Units.small,
  },
  playButtonContainer: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    marginHorizontal: Units.medium,
  },
  floatingVideoPlayer: {
    zIndex: 1000,
  },
  floatingVideoPlayerContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  rewindButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  fastForwardButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
};

// eslint-disable-next-line flowtype/generic-spacing
export const TranscriptionReviewModal: ComponentType<
  TranscriptionReviewModalProps
> = wrapWithTranscriptionReviewState(
  ({
    componentId,
    video,
    videoPlayerRef,
    playVideo,
    seekVideoToTime,
    playbackState,
    setPlaybackState,
    pauseVideo,
    playbackTime,
    setPlaybackTime,
    speechTranscription,
    speechTranscriptionSegmentSelection,
    setSpeechTranscriptionSegmentSelection,
    bottomSafeAreaInset,
    onSpeechTranscriptionChange,
  }) => {
    const dismiss = async () => {
      await Screens.dismissTranscriptionReviewScreen(componentId);
    };
    const segments = speechTranscription
      ? interpolateSegments(speechTranscription.segments)
      : null;
    const setSegmentSelection = (playbackTime: number) => {
      if (segments) {
        const index = Math.max(
          findIndexOfSegmentAtPlaybackTime(segments, playbackTime),
          0
        );
        setSpeechTranscriptionSegmentSelection({
          startIndex: index,
          endIndex: index,
        });
      }
    };
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView
          style={styles.flex}
          keyboardVerticalOffset={-(bottomSafeAreaInset || 0) + 7}
        >
          <SafeAreaView style={styles.flex}>
            <View style={styles.playbackControlsContainer}>
              <View style={styles.playbackControls}>
                <DoneButton
                  style={styles.flex}
                  onPress={() => {
                    dismiss();
                  }}
                />
                <View style={styles.playButtonContainer}>
                  <RewindButton
                    style={styles.rewindButton}
                    onPress={() => {
                      const time = Math.max(playbackTime - 5, 0);
                      setPlaybackTime(time);
                      seekVideoToTime(time);
                      setSegmentSelection(time);
                      hapticFeedback();
                    }}
                  />
                  <PlayButton
                    style={styles.playButton}
                    playbackState={playbackState}
                    onPressPlay={playVideo}
                    onPressPause={pauseVideo}
                  />
                  <FastForwardButton
                    style={styles.fastForwardButton}
                    onPress={() => {
                      const time = Math.min(playbackTime + 5, video.duration);
                      setPlaybackTime(time);
                      seekVideoToTime(time);
                      setSegmentSelection(time);
                      hapticFeedback();
                    }}
                  />
                </View>
                <View style={styles.flex} />
              </View>
              <PlaybackSlider
                value={playbackTime}
                min={0}
                max={video.duration}
                onSelectValue={playbackTime => {
                  setPlaybackTime(playbackTime);
                  seekVideoToTime(playbackTime);
                  setSegmentSelection(playbackTime);
                }}
              />
            </View>
            <View style={styles.transcriptionContainer}>
              <ScrollView contentContainerStyle={styles.scrollViewContents}>
                <TranscriptionTextInput
                  speechTranscriptionSegments={segments}
                  speechTranscriptionSegmentSelection={
                    speechTranscriptionSegmentSelection
                  }
                  onSelectionChange={
                    setSpeechTranscriptionSegmentSelection
                    // TODO: set playbackTime to match first segment in selection
                  }
                  onSpeechTranscriptionSegmentsChange={segments => {
                    if (!segments || !speechTranscription) {
                      return;
                    }
                    onSpeechTranscriptionChange({
                      ...speechTranscription,
                      segments,
                    });
                  }}
                />
              </ScrollView>
              <MeasureContentsView
                style={styles.floatingVideoPlayerContainer}
                renderChildren={size => {
                  const width = 100;
                  const height = 16 / 9 * width;
                  const padding = { bottom: Units.small, left: Units.small };
                  const initialPosition = {
                    x: padding.left,
                    y: size.height - Units.small - height,
                  };
                  return (
                    <FloatingVideoPlayer
                      style={styles.floatingVideoPlayer}
                      initialPosition={initialPosition}
                      videoID={video.assetID}
                      videoPlayerRef={videoPlayerRef}
                      onVideoDidUpdatePlaybackTime={playbackTime => {
                        setPlaybackTime(playbackTime);
                        setSegmentSelection(playbackTime);
                      }}
                      onPlaybackStateChange={setPlaybackState}
                      onVideoWillRestart={() => {
                        setPlaybackTime(0);
                        setSegmentSelection(0);
                      }}
                    />
                  );
                }}
              />
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    );
  }
);
