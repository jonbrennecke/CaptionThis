// @flow
import React from 'react';
import {
  StatusBar,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
// $FlowFixMe
import { withSafeArea } from 'react-native-safe-area';
import ReactNativeHaptic from 'react-native-haptic';

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
  findSegmentsInSelectedSegmentRange,
  interpolateSegments,
  findIndexOfSegmentAtPlaybackTime,
} from './transcriptionReviewUtils';
import { PlayButton } from './PlayButton';

import type { ComponentType } from 'react';

import type { TranscriptionReviewStateHOCProps } from './transcriptionReviewState';

export type TranscriptionReviewModalProps = {};

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
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// eslint-disable-next-line flowtype/generic-spacing
export const TranscriptionReviewModal: ComponentType<
  TranscriptionReviewModalProps
> = wrapWithTranscriptionReviewState(
  ({
    videoPlayerRef,
    playVideo,
    seekVideoToTime,
    playbackState,
    setPlaybackState,
    pauseVideo,
    playbackTime,
    setPlaybackTime,
    speechTranscriptions,
    setSpeechTranscription,
    speechTranscriptionSegmentSelection,
    setSpeechTranscriptionSegmentSelection,
    bottomSafeAreaInset,
    componentIsVisible,
    dismissScreen,
    navigation,
  }: TranscriptionReviewModalProps & TranscriptionReviewStateHOCProps) => {
    const video = navigation.getParam('video');
    const speechTranscription = speechTranscriptions.get(video.assetID);
    const segments = speechTranscription
      ? interpolateSegments(speechTranscription.segments)
      : null;
    const setSegmentSelection = (playbackTime: number) => {
      if (segments) {
        const index = findIndexOfSegmentAtPlaybackTime(segments, playbackTime);
        setSpeechTranscriptionSegmentSelection({
          startIndex: index,
          endIndex: index,
        });
      }
    };
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.solid.darkGray} />
        </View>
        {componentIsVisible && (
          <View style={StyleSheet.absoluteFill}>
            <KeyboardAvoidingView
              style={styles.flex}
              keyboardVerticalOffset={-(bottomSafeAreaInset || 0)}
            >
              <SafeAreaView style={styles.flex}>
                <View style={styles.playbackControlsContainer}>
                  <View style={styles.playbackControls}>
                    <DoneButton
                      style={styles.flex}
                      onPress={dismissScreen}
                      color={Colors.solid.heliotrope}
                    />
                    <View style={styles.playButtonContainer}>
                      <RewindButton
                        style={styles.rewindButton}
                        color={Colors.solid.heliotrope}
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
                        color={Colors.solid.heliotrope}
                        onPressPlay={playVideo}
                        onPressPause={pauseVideo}
                      />
                      <FastForwardButton
                        style={styles.fastForwardButton}
                        color={Colors.solid.heliotrope}
                        onPress={() => {
                          const time = Math.min(
                            playbackTime + 5,
                            video.duration
                          );
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
                    color={Colors.solid.heliotrope}
                    onSelectValue={playbackTime => {
                      setPlaybackTime(playbackTime);
                      seekVideoToTime(playbackTime);
                      setSegmentSelection(playbackTime);
                    }}
                    onDidBeginDrag={() => {
                      pauseVideo();
                    }}
                  />
                </View>
                <View style={styles.transcriptionContainer}>
                  <ScrollView contentContainerStyle={styles.scrollViewContents}>
                    <TranscriptionTextInput
                      textHighlightColor={Colors.solid.heliotrope}
                      speechTranscriptionSegments={segments}
                      speechTranscriptionSegmentSelection={
                        speechTranscriptionSegmentSelection
                      }
                      onSelectionChange={selection => {
                        setSpeechTranscriptionSegmentSelection(selection);
                        if (selection && segments) {
                          const firstSelectedSegment = findSegmentsInSelectedSegmentRange(
                            segments,
                            selection
                          )[0];
                          if (firstSelectedSegment) {
                            const time = firstSelectedSegment.timestamp;
                            setPlaybackTime(time);
                            seekVideoToTime(time);
                          }
                        }
                      }}
                      onSpeechTranscriptionSegmentsChange={segments => {
                        if (!segments || !speechTranscription) {
                          return;
                        }
                        setSpeechTranscription(video.assetID, {
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
                      const padding = {
                        bottom: Units.small,
                        left: Units.small,
                      };
                      const initialPosition = {
                        x: padding.left,
                        y: size.height - Units.small - height,
                      };
                      return (
                        <FloatingVideoPlayer
                          style={styles.floatingVideoPlayer}
                          iconAccentColor={Colors.solid.heliotrope}
                          initialPosition={initialPosition}
                          videoID={video.assetID}
                          videoPlayerRef={videoPlayerRef}
                          onVideoDidUpdatePlaybackTime={playbackTime => {
                            setPlaybackTime(playbackTime);
                            setSegmentSelection(playbackTime);
                          }}
                          onPlaybackStateChange={setPlaybackState}
                          onVideoDidPlayToEnd={() => {
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
        )}
      </View>
    );
  }
);
