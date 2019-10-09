// @flow
import React from 'react';
import { Modal, StatusBar, View, StyleSheet, ScrollView } from 'react-native';
// $FlowFixMe
import { withSafeArea } from 'react-native-safe-area';

import KeyboardAvoidingView from '../../../components/keyboard-avoiding-view/KeyboardAvoidingView';
import { wrapWithTranscriptionReviewState } from './transcriptionReviewState';
import { TranscriptionTextInput } from './TranscriptionTextInput';
import { TranscriptionReviewModalPlaybackSlider } from './TranscriptionReviewModalPlaybackSlider';
import { FloatingVideoPlayer, MeasureContentsView } from '../../../components';
import { BackIcon } from '../../../components/icons';
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
  video: MediaObject,
  isVisible: boolean,
  speechTranscription: ?SpeechTranscription,
  onRequestDismiss: () => void,
  onSpeechTranscriptionChange: SpeechTranscription => void,
};

const SafeAreaView = withSafeArea(View, 'padding', 'vertical');

const styles = {
  flex: {
    flex: 1,
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
    paddingVertical: Units.extraSmall,
    paddingHorizontal: Units.small,
  },
  playButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {},
  floatingVideoPlayer: {
    zIndex: 1000,
  },
  floatingVideoPlayerContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backIcon: {
    height: Units.extraLarge,
    width: Units.extraLarge,
  },
  spacer: {
    flex: 1,
  },
};

// eslint-disable-next-line flowtype/generic-spacing
export const TranscriptionReviewModal: ComponentType<
  TranscriptionReviewModalProps
> = wrapWithTranscriptionReviewState(
  ({
    video,
    videoPlayerRef,
    playVideo,
    seekVideoToTime,
    playbackState,
    setPlaybackState,
    pauseVideo,
    isVisible,
    playbackTime,
    setPlaybackTime,
    onRequestDismiss,
    speechTranscription,
    speechTranscriptionSegmentSelection,
    setSpeechTranscriptionSegmentSelection,
    bottomSafeAreaInset,
    onSpeechTranscriptionChange,
  }) => {
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
      <Modal visible={isVisible} onRequestDismissModal={onRequestDismiss}>
        {isVisible && <StatusBar barStyle="dark-content" />}
        <KeyboardAvoidingView
          style={styles.flex}
          keyboardVerticalOffset={-(bottomSafeAreaInset || 0) + 7}
        >
          <SafeAreaView style={styles.flex}>
            <View style={styles.playbackControlsContainer}>
              <View style={styles.playbackControls}>
                <View style={styles.backButtonContainer}>
                  <BackIcon
                    style={styles.backIcon}
                    color={Colors.solid.nimbus}
                  />
                </View>
                <View style={styles.playButtonContainer}>
                  <PlayButton
                    style={styles.playButton}
                    playbackState={playbackState}
                    onPressPlay={playVideo}
                    onPressPause={pauseVideo}
                  />
                </View>
                <View style={styles.spacer} />
              </View>
              <TranscriptionReviewModalPlaybackSlider
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
      </Modal>
    );
  }
);
