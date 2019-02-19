// @flow
import React, { Component } from 'react';
import { SafeAreaView, Dimensions, StyleSheet } from 'react-native';
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
import ScaleAnimatedView from '../../components/animations/ScaleAnimatedView';

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
  playbackTime: number,
  isDraggingSeekbar: boolean,
  isVideoReadyToPlay: boolean,
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
    playbackTime: 0,
    isDraggingSeekbar: false,
    isVideoReadyToPlay: false,
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

  seekBarDidSeekToTimeThrottled = throttle(this.seekBarDidSeekToTime, 50, {
    leading: true,
  });

  seekBarDidSeekToTime(time: number) {
    this.seekToTime(time);
    this.onRequestChangePlaybackTimeThrottled(time);
  }

  seekBarDidStartSeeking() {
    this.pausePlayerAndCaptions();
    this.setState({ isDraggingSeekbar: true });
  }

  seekBarDidStopSeeking() {
    this.setState({ isDraggingSeekbar: false });
    this.startPlayerAndCaptions();
  }

  async seekToTime(time: number) {
    if (this.playerView) {
      await this.playerView.seekToTime(time);
    }
    if (this.captionsView) {
      this.captionsView.seekToTime(time);
    }
  }

  onRequestChangePlaybackTimeThrottled = throttle(
    this.props.onRequestChangePlaybackTime,
    50,
    {
      leading: true,
    }
  );

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
      this.setState({
        isVideoReadyToPlay: true
      });
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

  videoPlayerDidUpdatePlaybackTimeThrottled = throttle(
    this.videoPlayerDidUpdatePlaybackTime,
    50,
    {
      leading: true,
    }
  );

  videoPlayerDidUpdatePlaybackTime(playbackTime: number) {
    this.setState({ playbackTime });
  }

  videoPlayerDidRestart() {
    this.restartCaptions();
  }

  restartPlayerAndCaptions() {
    this.restartCaptions();
    this.restartPlayer();
  }

  startPlayerAndCaptions() {
    this.startCaptions();
    this.startPlayer();
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

  startPlayer() {
    if (!this.playerView) {
      return;
    }
    this.playerView.play();
    Debug.log('Player started.');
  }

  startCaptions() {
    if (this.captionsView) {
      this.captionsView.play();
    }
    Debug.log('Captions started.');
  }

  pausePlayer() {
    if (!this.playerView) {
      return;
    }
    this.playerView.pause();
    Debug.log('Player paused.');
  }

  pauseCaptions() {
    if (this.captionsView) {
      this.captionsView.pause();
    }
    this.props.onDidPauseCaptions();
    Debug.log('Captions paused.');
  }

  render() {
    const showSeekbar =
      this.props.isReadyToPlay && !this.props.isDeviceLimitedByMemory;
    return (
      <SafeAreaView style={styles.flex}>
        {this.props.isReadyToPlay && (
          <ScaleAnimatedView style={styles.videoWrap} isVisible={this.state.isVideoReadyToPlay}>
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
                this.videoPlayerDidUpdatePlaybackTimeThrottled
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
          </ScaleAnimatedView>
        )}
        {showSeekbar && (
          <ScaleAnimatedView isVisible={this.state.isVideoReadyToPlay} style={styles.editControls}>
            <VideoSeekbar
              style={styles.flex}
              duration={this.props.duration}
              playbackTime={this.state.playbackTime}
              videoAssetIdentifier={this.props.video.id}
              onSeekToTime={this.seekBarDidSeekToTimeThrottled}
              onDidBeginDrag={this.seekBarDidStartSeeking}
              onDidEndDrag={this.seekBarDidStopSeeking}
            />
          </ScaleAnimatedView>
        )}
      </SafeAreaView>
    );
  }
}
