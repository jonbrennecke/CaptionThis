// @flow
import React, { Component } from 'react';
import { View, SafeAreaView, Dimensions, StyleSheet } from 'react-native';
import clamp from 'lodash/clamp';
import throttle from 'lodash/throttle';
import { autobind } from 'core-decorators';

import { UI_COLORS } from '../../constants';
import * as Debug from '../../utils/Debug';
import ScreenGradients from '../../components/screen-gradients/ScreenGradients';
import VideoCaptionsContainer from '../../components/video-captions-view/VideoCaptionsContainer';
import VideoSeekbar from '../../components/video-seekbar/VideoSeekbar';
import EditScreenTopControls from './EditScreenTopControls';
import VideoPlayerView from '../../components/video-player-view/VideoPlayerView';
import VideoCaptionsView from '../../components/video-captions-view/VideoCaptionsView';

import type { Orientation, VideoObject, ColorRGBA } from '../../types/media';
import type { SpeechTranscription } from '../../types/speech';
import type { LineStyle } from '../../types/video';

type Props = {
  video: VideoObject,
  isAppInForeground: boolean,
  isDeviceLimitedByMemory: boolean,
  isCaptionsEditorVisible: boolean,
  isReadyToPlay: boolean,
  isExportingVideo: boolean,
  duration: number,
  playbackTime: number,
  duration: number,
  fontFamily: string,
  fontSize: number,
  textColor: ColorRGBA,
  backgroundColor: ColorRGBA,
  speechTranscription: ?SpeechTranscription,
  lineStyle: LineStyle,
  orientation: Orientation,
  onRequestChangeDuration: number => void,
  onRequestChangePlaybackTime: number => void,
  onRequestChangeOrientation: Orientation => void,
  onRequestShowRichTextEditor: () => void,
  onRequestShowCaptionsEditor: () => void,
  onRequestPopToHomeScreen: () => void,
  onRequestExport: () => void,
  onDidPauseCaptions: () => void,
  onDidRestartCaptions: () => void,
};

type State = {
  isDraggingSeekbar: boolean,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = {
  flex: {
    flex: 1,
  },
  videoWrap: {
    borderRadius: 10,
    flex: 1,
    flexGrow: 1,
    overflow: 'hidden',
    backgroundColor: UI_COLORS.DARK_GREY,
  },
  captionsContainer: StyleSheet.absoluteFillObject,
  playbackControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  editControls: {
    height: 70,
    width: SCREEN_WIDTH,
    paddingTop: 10,
    // TODO: The bottom padding is only necessary because of the seekbar handle being cut off in phones without a notch (i.e. iPhones older than the X series)
    paddingBottom: 3,
  },
  editTopControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  seekbarWrap: {
    flexDirection: 'row',
  },
};

// $FlowFixMe
@autobind
export default class EditScreenVideoPlayer extends Component<Props, State> {
  captionsView: ?VideoCaptionsView;
  playerView: ?VideoPlayerView;
  state = {
    isDraggingSeekbar: false,
  };

  componentDidUpdate(prevProps: Props) {
    if (this.props.isAppInForeground && !prevProps.isAppInForeground) {
      this.appWillEnterForeground();
    } else if (!this.props.isAppInForeground && prevProps.isAppInForeground) {
      this.appWillEnterBackground();
    }
    if (
      this.props.isCaptionsEditorVisible &&
      !prevProps.isCaptionsEditorVisible
    ) {
      this.onDidPresentCaptionsEditor();
    } else if (
      !this.props.isCaptionsEditorVisible &&
      prevProps.isCaptionsEditorVisible
    ) {
      this.onDidDismissCaptionsEditor();
    }
    if (this.props.isExportingVideo && !prevProps.isExportingVideo) {
      this.onDidBeginExport();
    } else if (!this.props.isExportingVideo && prevProps.isExportingVideo) {
      this.onDidEndExport();
    }
    // TODO: restart player and captions when speech transcription is finalized
  }

  appWillEnterBackground() {
    this.pausePlayerAndCaptions();
  }

  appWillEnterForeground() {
    this.restartPlayerAndCaptions();
  }

  onDidPresentCaptionsEditor() {
    this.pausePlayerAndCaptions();
  }

  onDidDismissCaptionsEditor() {
    this.restartPlayerAndCaptions();
  }

  onDidBeginExport() {
    this.pausePlayerAndCaptions();
  }

  onDidEndExport() {
    this.restartPlayerAndCaptions();
  }

  seekBarDidSeekToTimeThrottled = throttle(this.seekBarDidSeekToTime, 100, {
    leading: true,
  });

  seekBarDidSeekToTime(timeSeconds: number) {
    if (!this.state.isDraggingSeekbar) {
      return;
    }
    const playbackTime = clamp(timeSeconds, 0, this.props.duration);
    this.props.onRequestChangePlaybackTime(playbackTime);
    if (this.captionsView) {
      this.captionsView.seekToTime(playbackTime);
    }
    if (this.playerView) {
      this.playerView.seekToTime(playbackTime);
    }
  }

  seekBarDidStartSeeking() {
    this.pausePlayerAndCaptions();
    this.setState({ isDraggingSeekbar: true });
  }

  seekBarDidStopSeeking() {
    // TODO: this.resumePlayerAndCaptions();
    this.restartPlayerAndCaptions();
    this.setState({ isDraggingSeekbar: true });
  }

  async videoPlayerDidBecomeReadyToPlay(
    duration: number,
    orientation: Orientation
  ) {
    this.props.onRequestChangeDuration(duration);
    this.props.onRequestChangeOrientation(orientation);
    if (!this.props.isReadyToPlay) {
      this.pausePlayerAndCaptions();
    } else {
      this.restartPlayerAndCaptions();
    }
  }

  videoPlayerDidFailToLoad() {
    Debug.log('Video player failed to load');
    this.pausePlayerAndCaptions();
  }

  videoPlayerDidPause() {
    Debug.log('Video player paused');
    this.pauseCaptions();
  }

  videoPlayerDidUpdatePlaybackTime(playbackTime: number) {
    if (this.state.isDraggingSeekbar) {
      return;
    }
    this.props.onRequestChangePlaybackTime(playbackTime);
  }

  videoPlayerDidRestart() {
    this.restartCaptions();
  }

  restartPlayerAndCaptions() {
    this.restartCaptions();
    this.restartPlayer();
  }

  restartCaptions() {
    if (this.captionsView) {
      this.captionsView.restart();
    }
    this.props.onDidRestartCaptions();
  }

  restartPlayer() {
    if (!this.playerView) {
      return;
    }
    this.playerView.restart();
  }

  pausePlayerAndCaptions() {
    this.pausePlayer();
    this.pauseCaptions();
  }

  pausePlayer() {
    if (!this.playerView) {
      return;
    }
    this.playerView.pause();
  }

  pauseCaptions() {
    if (this.captionsView) {
      this.captionsView.pause();
    }
    this.props.onDidPauseCaptions();
  }

  render() {
    const showSeekbar =
      this.props.isReadyToPlay && !this.props.isDeviceLimitedByMemory;
    return (
      <SafeAreaView style={styles.flex}>
        {this.props.isReadyToPlay && (
          <View style={styles.videoWrap}>
            <VideoPlayerView
              ref={ref => {
                this.playerView = ref;
              }}
              style={styles.flex}
              videoAssetIdentifier={this.props.video.id}
              onVideoDidBecomeReadyToPlay={(...args) => {
                this.videoPlayerDidBecomeReadyToPlay(...args);
              }}
              onVideoDidFailToLoad={this.videoPlayerDidFailToLoad}
              onVideoDidPause={this.videoPlayerDidPause}
              onVideoDidUpdatePlaybackTime={
                this.videoPlayerDidUpdatePlaybackTime
              }
              onVideoDidRestart={this.videoPlayerDidRestart}
            />
            <ScreenGradients />
            <VideoCaptionsContainer
              style={styles.captionsContainer}
              orientation={this.props.orientation}
            >
              <VideoCaptionsView
                ref={ref => {
                  this.captionsView = ref;
                }}
                style={styles.flex}
                hasFinalTranscription={this.props.isReadyToPlay}
                orientation={this.props.orientation}
                duration={this.props.duration}
                lineStyle={this.props.lineStyle}
                textColor={this.props.textColor}
                backgroundColor={this.props.backgroundColor}
                fontFamily={this.props.fontFamily}
                fontSize={this.props.fontSize}
                speechTranscription={this.props.speechTranscription}
                onPress={this.props.onRequestShowRichTextEditor}
              />
            </VideoCaptionsContainer>
            <EditScreenTopControls
              style={styles.editTopControls}
              isReadyToExport={this.props.isReadyToPlay}
              onBackButtonPress={this.props.onRequestPopToHomeScreen}
              onExportButtonPress={this.props.onRequestExport}
              onStylizeButtonPress={this.props.onRequestShowRichTextEditor}
              onEditTextButtonPress={this.props.onRequestShowCaptionsEditor}
            />
          </View>
        )}
        {showSeekbar && (
          <View style={styles.editControls}>
            <VideoSeekbar
              style={styles.flex}
              duration={this.props.duration}
              playbackTime={this.props.playbackTime}
              videoAssetIdentifier={this.props.video.id}
              onSeekToTime={this.seekBarDidSeekToTimeThrottled}
              onDidBeginDrag={this.seekBarDidStartSeeking}
              onDidEndDrag={this.seekBarDidStopSeeking}
            />
          </View>
        )}
      </SafeAreaView>
    );
  }
}
