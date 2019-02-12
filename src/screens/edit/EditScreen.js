// @flow
import React, { Component } from 'react';
import {
  View,
  SafeAreaView,
  Dimensions,
  Alert,
  StyleSheet,
  AppState as ReactAppState,
} from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import clamp from 'lodash/clamp';
import throttle from 'lodash/throttle';

import * as Debug from '../../utils/Debug';
import { UI_COLORS } from '../../constants';
import ScreenGradients from '../../components/screen-gradients/ScreenGradients';
import VideoPlayerView from '../../components/video-player-view/VideoPlayerView';
import VideoCaptionsView from '../../components/video-captions-view/VideoCaptionsView';
import VideoCaptionsContainer from '../../components/video-captions-view/VideoCaptionsContainer';
import VideoSeekbar from '../../components/video-seekbar/VideoSeekbar';
import EditScreenTopControls from './EditScreenTopControls';
import EditScreenRichTextOverlay from './EditScreenRichTextOverlay';
import EditScreenExportingOverlay from './EditScreenExportingOverlay';
import EditScreenLoadingOverlay from './EditScreenLoadingOverlay';
import EditScreenLoadingBackground from './EditScreenLoadingBackground';
import EditScreenEditCaptionsOverlay from './EditScreenEditCaptionsOverlay';
import SpeechManager from '../../utils/SpeechManager';
import { exportVideo } from '../../redux/media/actionCreators';
import {
  beginSpeechTranscriptionWithVideoAsset,
  receiveSpeechTranscriptionSuccess,
  receiveSpeechTranscriptionFailure,
} from '../../redux/speech/actionCreators';
import {
  receiveUserSelectedFontFamily,
  receiveUserSelectedTextColor,
  receiveUserSelectedBackgroundColor,
  receiveUserSelectedFontSize,
} from '../../redux/video/actionCreators';
import { isExportingVideo } from '../../redux/media/selectors';
import {
  getSpeechTranscriptions,
  didSpeechRecognitionFail,
} from '../../redux/speech/selectors';
import {
  getBackgroundColor,
  getTextColor,
  getFontFamily,
  getFontSize,
  getLineStyle,
} from '../../redux/video/selectors';
import { receiveAppStateChange } from '../../redux/device/actionCreators';
import {
  isAppInForeground,
  isDeviceLimitedByMemory,
} from '../../redux/device/selectors';

import type {
  VideoAssetIdentifier,
  VideoObject,
  ColorRGBA,
  ImageOrientation,
} from '../../types/media';
import type { Dispatch, AppState } from '../../types/redux';
import type { SpeechTranscription } from '../../types/speech';
import type { LineStyle } from '../../types/video';
import type { ReactAppStateEnum } from '../../types/react';
import type { ExportParams } from '../../utils/VideoExportManager';
import type { EmitterSubscription as SpeechManagerSubscription } from '../../utils/SpeechManager';

type State = {
  duration: number,
  orientation: ?ImageOrientation,
  playbackTime: number,
  isVideoPlaying: boolean,
  isDraggingSeekbar: boolean,
  showRichTextOverlay: boolean,
  showEditCaptionsOverlay: boolean,
};

type OwnProps = {
  componentId: string,
  video: VideoObject,
};

type StateProps = {
  speechTranscriptions: Map<VideoAssetIdentifier, SpeechTranscription>,
  fontFamily: string,
  backgroundColor: ColorRGBA,
  textColor: ColorRGBA,
  isExportingVideo: boolean,
  fontSize: number,
  didSpeechRecognitionFail: boolean,
  lineStyle: LineStyle,
  isAppInForeground: boolean,
  isDeviceLimitedByMemory: boolean,
};

type DispatchProps = {
  beginSpeechTranscriptionWithVideoAsset: VideoAssetIdentifier => Promise<void>,
  receiveSpeechTranscriptionSuccess: (
    VideoAssetIdentifier,
    SpeechTranscription
  ) => void,
  receiveSpeechTranscriptionFailure: VideoAssetIdentifier => void,
  exportVideo: ExportParams => Promise<void>,
  receiveUserSelectedFontFamily: (fontFamily: string) => void,
  receiveUserSelectedTextColor: (color: ColorRGBA) => void,
  receiveUserSelectedBackgroundColor: (color: ColorRGBA) => void,
  receiveUserSelectedFontSize: (fontSize: number) => void,
  receiveAppStateChange: (appState: ReactAppStateEnum) => void,
};

type Props = OwnProps & StateProps & DispatchProps;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = {
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.BLACK,
  },
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

function mapStateToProps(state: AppState): StateProps {
  return {
    speechTranscriptions: getSpeechTranscriptions(state),
    fontFamily: getFontFamily(state),
    backgroundColor: getBackgroundColor(state),
    textColor: getTextColor(state),
    isExportingVideo: isExportingVideo(state),
    fontSize: getFontSize(state),
    didSpeechRecognitionFail: didSpeechRecognitionFail(state),
    lineStyle: getLineStyle(state),
    isAppInForeground: isAppInForeground(state),
    isDeviceLimitedByMemory: isDeviceLimitedByMemory(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    beginSpeechTranscriptionWithVideoAsset: (id: VideoAssetIdentifier) =>
      dispatch(beginSpeechTranscriptionWithVideoAsset(id)),
    receiveSpeechTranscriptionSuccess: (
      id: VideoAssetIdentifier,
      transcription: SpeechTranscription
    ) => dispatch(receiveSpeechTranscriptionSuccess(id, transcription)),
    receiveSpeechTranscriptionFailure: (id: VideoAssetIdentifier) =>
      dispatch(receiveSpeechTranscriptionFailure(id)),
    exportVideo: (exportParams: ExportParams) =>
      dispatch(exportVideo(exportParams)),
    receiveUserSelectedFontFamily: (fontFamily: string) =>
      dispatch(receiveUserSelectedFontFamily(fontFamily)),
    receiveUserSelectedTextColor: (color: ColorRGBA) =>
      dispatch(receiveUserSelectedTextColor(color)),
    receiveUserSelectedBackgroundColor: (color: ColorRGBA) =>
      dispatch(receiveUserSelectedBackgroundColor(color)),
    receiveUserSelectedFontSize: (fontSize: number) =>
      dispatch(receiveUserSelectedFontSize(fontSize)),
    receiveAppStateChange: (appState: ReactAppStateEnum) =>
      dispatch(receiveAppStateChange(appState)),
  };
}

// $FlowFixMe
@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class EditScreen extends Component<Props, State> {
  captionsView: ?VideoCaptionsView;
  playerView: ?VideoPlayerView;
  richTextOverlay: ?EditScreenRichTextOverlay;
  state: State = {
    playbackTime: 0,
    duration: 0,
    orientation: null,
    isVideoPlaying: false,
    isDraggingSeekbar: false,
    showRichTextOverlay: false,
    showEditCaptionsOverlay: false,
  };
  didReceiveSpeechTranscriptionSubscription: ?SpeechManagerSubscription;
  didNotDetectSpeechSubscription: ?SpeechManagerSubscription;

  async componentDidMount() {
    this.didReceiveSpeechTranscriptionSubscription = SpeechManager.addDidReceiveSpeechTranscriptionListener(
      this.speechManagerDidReceiveSpeechTranscription
    );
    this.didNotDetectSpeechSubscription = SpeechManager.addDidNotDetectSpeechListener(
      this.speechManagerDidNotDetectSpeech
    );
    await this.props.beginSpeechTranscriptionWithVideoAsset(
      this.props.video.id
    );
    ReactAppState.addEventListener('change', this.handleAppStateWillChange);
    if (this.hasFinalSpeechTranscription()) {
      this.speechManagerDidReceiveFinalSpeechTranscription();
    }
  }

  componentWillUnmount() {
    ReactAppState.removeEventListener('change', this.handleAppStateWillChange);
    if (this.didReceiveSpeechTranscriptionSubscription) {
      this.didReceiveSpeechTranscriptionSubscription.remove();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const speechTranscription = this.getSpeechTranscription(this.props);
    const prevSpeechTranscription = this.getSpeechTranscription(prevProps);
    if (speechTranscription?.isFinal && !prevSpeechTranscription?.isFinal) {
      this.speechManagerDidReceiveFinalSpeechTranscription();
    }
    if (
      this.props.didSpeechRecognitionFail &&
      !prevProps.didSpeechRecognitionFail
    ) {
      this.presentTranscriptionFailureAlert();
    }
    if (this.props.isAppInForeground && !prevProps.isAppInForeground) {
      this.appWillEnterForeground();
    } else if (!this.props.isAppInForeground && prevProps.isAppInForeground) {
      this.appWillEnterBackground();
    }
  }

  handleAppStateWillChange(nextAppState: ReactAppStateEnum) {
    this.props.receiveAppStateChange(nextAppState);
  }

  appWillEnterBackground() {
    this.pausePlayerAndCaptions();
  }

  appWillEnterForeground() {
    this.restartPlayerAndCaptions();
  }

  presentTranscriptionFailureAlert() {
    Alert.alert(
      'Failed to generate captions',
      "Unfortunately, We weren't able to detect any speech. Try again and speak clearly into the microphone.",
      [
        {
          text: 'OK',
          onPress: async () => {
            await Navigation.dismissAllModals();
            await Navigation.popToRoot(this.props.componentId);
          },
        },
      ],
      { cancelable: false }
    );
  }

  async videoPlayerDidBecomeReadyToPlay(
    duration: number,
    orientation: ImageOrientation
  ) {
    this.setState({ duration, orientation });
    if (!this.isReadyToPlay()) {
      this.pausePlayerAndCaptions();
    } else {
      this.restartPlayerAndCaptions();
    }
  }

  videoPlayerDidFailToLoad() {
    Debug.log('Video player failed to load');
    this.setState({ isVideoPlaying: false });
    this.pauseCaptions();
  }

  videoPlayerDidPause() {
    Debug.log('Video player paused');
    this.setState({ isVideoPlaying: false });
    this.pauseCaptions();
  }

  videoPlayerDidUpdatePlaybackTime(playbackTime: number, duration: number) {
    if (this.state.isDraggingSeekbar) {
      return;
    }
    this.setState({
      playbackTime,
      duration,
    });
  }

  videoPlayerDidRestart() {
    this.restartCaptions();
  }

  speechManagerDidReceiveSpeechTranscription(
    transcription: SpeechTranscription
  ) {
    if (!transcription) {
      this.props.receiveSpeechTranscriptionFailure(this.props.video.id);
      return;
    }
    this.props.receiveSpeechTranscriptionSuccess(
      this.props.video.id,
      transcription
    );
  }

  speechManagerDidReceiveFinalSpeechTranscription() {
    this.setState({
      playbackTime: 0,
    });
    this.restartPlayerAndCaptions();
  }

  speechManagerDidNotDetectSpeech() {
    this.props.receiveSpeechTranscriptionFailure(this.props.video.id);
  }

  seekBarDidSeekToTimeThrottled = throttle(this.seekBarDidSeekToTime, 100, {
    leading: true,
  });

  seekBarDidSeekToTime(timeSeconds: number) {
    const time = clamp(timeSeconds, 0, this.state.duration);
    this.setState({
      playbackTime: time,
    });
    if (this.captionsView) {
      this.captionsView.seekToTime(time);
    }
    if (this.playerView) {
      this.playerView.seekToTime(time);
    }
  }

  async richTextEditorDidRequestSave(params: {
    fontSize: number,
    fontFamily: string,
    textColor: ColorRGBA,
    backgroundColor: ColorRGBA,
  }) {
    this.props.receiveUserSelectedFontSize(params.fontSize);
    this.props.receiveUserSelectedFontFamily(params.fontFamily);
    this.props.receiveUserSelectedTextColor(params.textColor);
    this.props.receiveUserSelectedBackgroundColor(params.backgroundColor);
    this.setState({
      showRichTextOverlay: false,
    });
  }

  async onDidPressBackButton() {
    await Navigation.popToRoot(this.props.componentId);
  }

  async onDidPressExportButton() {
    this.pausePlayerAndCaptions();
    await this.exportVideo();
    this.restartPlayerAndCaptions();
  }

  async exportVideo() {
    await this.props.exportVideo({
      video: this.props.video.id,
      textSegments: this.textOverlayParams(),
      textColor: this.props.textColor,
      backgroundColor: this.props.backgroundColor,
      fontFamily: this.props.fontFamily,
      fontSize: this.props.fontSize,
      duration: this.state.duration,
      lineStyle: this.props.lineStyle,
      orientation: this.state.orientation || 'up',
    });
  }

  textOverlayParams() {
    const speechTranscription = this.getSpeechTranscription();
    if (!speechTranscription) {
      return [];
    }
    return speechTranscription.segments.map(segment => ({
      duration: segment.duration,
      timestamp: segment.timestamp,
      text: segment.substring,
    }));
  }

  isReadyToPlay(): boolean {
    return this.hasFinalSpeechTranscription();
  }

  getSpeechTranscription(props?: Props = this.props): ?SpeechTranscription {
    const {
      speechTranscriptions,
      video: { id },
    } = props;
    if (!speechTranscriptions.has(id)) {
      return null;
    }
    return speechTranscriptions.get(id);
  }

  hasFinalSpeechTranscription(): boolean {
    const speechTranscription = this.getSpeechTranscription();
    return !!(speechTranscription && speechTranscription.isFinal);
  }

  restartPlayerAndCaptions() {
    this.restartCaptions();
    this.restartPlayer();
  }

  restartCaptions() {
    if (this.captionsView) {
      this.captionsView.restart();
    }
    if (this.richTextOverlay) {
      this.richTextOverlay.restartCaptions();
    }
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
    if (this.richTextOverlay) {
      this.richTextOverlay.pauseCaptions();
    }
  }

  showEditCaptionsOverlay() {
    this.pausePlayerAndCaptions();
    this.setState({
      showEditCaptionsOverlay: true,
    });
  }

  dismissEditCaptionsOverlay() {
    this.restartPlayerAndCaptions();
    this.setState({
      showEditCaptionsOverlay: false,
    });
  }

  render() {
    const hasFinalTranscription = this.hasFinalSpeechTranscription();
    const showSeekbar =
      hasFinalTranscription && !this.props.isDeviceLimitedByMemory;
    return (
      <View style={styles.container}>
        {!hasFinalTranscription && <EditScreenLoadingBackground />}
        <SafeAreaView style={styles.flex}>
          {hasFinalTranscription && (
            <View style={styles.videoWrap}>
              <VideoPlayerView
                ref={ref => {
                  this.playerView = ref;
                }}
                style={styles.flex}
                isPlaying={this.state.isVideoPlaying}
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
                orientation={this.state.orientation}
              >
                <VideoCaptionsView
                  ref={ref => {
                    this.captionsView = ref;
                  }}
                  style={styles.flex}
                  hasFinalTranscription={hasFinalTranscription}
                  orientation={this.state.orientation || 'up'}
                  duration={this.state.duration}
                  lineStyle={this.props.lineStyle}
                  textColor={this.props.textColor}
                  backgroundColor={this.props.backgroundColor}
                  fontFamily={this.props.fontFamily}
                  fontSize={this.props.fontSize}
                  speechTranscription={this.getSpeechTranscription()}
                  onPress={this.showEditCaptionsOverlay}
                />
              </VideoCaptionsContainer>
              <EditScreenTopControls
                style={styles.editTopControls}
                isReadyToExport={!!hasFinalTranscription}
                onBackButtonPress={() => {
                  this.onDidPressBackButton();
                }}
                onExportButtonPress={() => {
                  this.onDidPressExportButton();
                }}
                onStylizeButtonPress={() =>
                  this.setState({
                    showRichTextOverlay: !this.state.showRichTextOverlay,
                  })
                }
                onEditTextButtonPress={this.showEditCaptionsOverlay}
              />
            </View>
          )}
          {showSeekbar && (
            <View style={styles.editControls}>
              <VideoSeekbar
                style={styles.flex}
                duration={this.state.duration}
                playbackTime={this.state.playbackTime}
                videoAssetIdentifier={this.props.video.id}
                onSeekToTime={this.seekBarDidSeekToTimeThrottled}
                onDidBeginDrag={() =>
                  this.setState({ isDraggingSeekbar: true })
                }
                onDidEndDrag={() => this.setState({ isDraggingSeekbar: false })}
              />
            </View>
          )}
        </SafeAreaView>
        <EditScreenRichTextOverlay
          ref={ref => {
            this.richTextOverlay = ref;
          }}
          playbackTime={this.state.playbackTime}
          hasFinalTranscription={hasFinalTranscription}
          duration={this.state.duration}
          isVisible={this.state.showRichTextOverlay}
          lineStyle={this.props.lineStyle}
          textColor={this.props.textColor}
          backgroundColor={this.props.backgroundColor}
          fontFamily={this.props.fontFamily}
          fontSize={this.props.fontSize}
          speechTranscription={this.getSpeechTranscription()}
          onRequestSave={(...etc) => {
            this.richTextEditorDidRequestSave(...etc);
          }}
        />
        <EditScreenExportingOverlay isVisible={this.props.isExportingVideo} />
        <EditScreenLoadingOverlay
          isVisible={!hasFinalTranscription}
          video={this.props.video}
        />
        <EditScreenEditCaptionsOverlay
          videoAssetIdentifier={this.props.video.id}
          speechTranscriptions={this.props.speechTranscriptions}
          isVisible={this.state.showEditCaptionsOverlay}
          onRequestDismissModal={this.dismissEditCaptionsOverlay}
          receiveSpeechTranscriptionSuccess={
            this.props.receiveSpeechTranscriptionSuccess
          }
        />
      </View>
    );
  }
}
