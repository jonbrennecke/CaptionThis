// @flow
import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  Text,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
// $FlowFixMe
import { withSafeArea } from 'react-native-safe-area';
import uuid from 'uuid';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import * as Screens from '../../utils/Screens';
import * as Camera from '../../utils/Camera';
import * as Debug from '../../utils/Debug';
import MediaManager from '../../utils/MediaManager';
import SpeechManager from '../../utils/SpeechManager';
import { requireOnboardedUser } from '../../utils/Onboarding';
import { arePermissionsGranted } from '../../redux/onboarding/selectors';
import {
  loadVideoAssets,
  beginSpeechTranscriptionWithAudioSession,
  endSpeechTranscriptionWithAudioSession,
  receiveSpeechTranscriptionFailure,
  receiveSpeechTranscriptionSuccess,
  beginCameraCapture,
  endCameraCapture,
  receiveFinishedVideo,
} from '../../redux/media/actionCreators';
import {
  getVideoAssetIdentifiers,
  isCameraRecording,
  getCurrentVideo,
  getFontFamily,
  getSpeechTranscriptions,
} from '../../redux/media/selectors';
import CameraPreviewView from '../../components/camera-preview-view/CameraPreviewView';
import VideoThumbnailGrid from '../../components/video-thumbnail-grid/VideoThumbnailGrid';
import ScreenGradients from '../../components/screen-gradients/ScreenGradients';
import HomeScreenCaptureControls from './HomeScreenCaptureControls';
import LiveTranscriptionView from '../../components/live-transcription-view/LiveTranscriptionView';
import CameraTapToFocusView from '../../components/camera-tap-to-focus-view/CameraTapToFocusView';

import type { Dispatch, AppState } from '../../types/redux';
import type { VideoAssetIdentifier } from '../../types/media';
import type { SpeechTranscription } from '../../types/speech';
import type { Return } from '../../types/util';

type State = {
  currentVideoIdentifier: ?VideoAssetIdentifier,
};

type OwnProps = {
  componentId: string,
};

type StateProps = {
  videoAssetIdentifiers: VideoAssetIdentifier[],
  arePermissionsGranted: boolean,
  isCameraRecording: boolean,
  currentVideo: ?VideoAssetIdentifier,
  fontFamily: string,
  speechTranscriptions: Return<typeof getSpeechTranscriptions>,
};

type DispatchProps = {
  loadVideoAssets: () => Promise<void>,
  beginCameraCapture: () => Promise<void>,
  endCameraCapture: () => Promise<void>,
  beginSpeechTranscriptionWithAudioSession: () => Promise<void>,
  endSpeechTranscriptionWithAudioSession: () => Promise<void>,
  receiveSpeechTranscriptionSuccess: (
    VideoAssetIdentifier,
    SpeechTranscription
  ) => void,
  receiveSpeechTranscriptionFailure: VideoAssetIdentifier => void,
  receiveFinishedVideo: VideoAssetIdentifier => void,
};

type Props = OwnProps & StateProps & DispatchProps;

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const SafeAreaView = withSafeArea(View, 'padding', 'vertical');

const styles = {
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.BLACK,
  },
  cameraPreview: {
    borderRadius: 10,
    flex: 1,
    overflow: 'hidden',
  },
  mediaHeader: {
    paddingVertical: 5,
    paddingHorizontal: 7,
    alignItems: 'flex-start',
  },
  mediaText: Fonts.getFontStyle('title', { contentStyle: 'lightContent' }),
  flex: {
    flex: 1,
  },
  captureControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  scrollView: {
    flex: 1,
    overflow: 'visible',
  },
  scrollViewContent: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 2,
  },
  transcript: {
    position: 'absolute',
    bottom: 125,
    left: 0,
    right: 0,
  },
  absoluteFill: StyleSheet.absoluteFill,
};

function mapStateToProps(state: AppState): StateProps {
  return {
    videoAssetIdentifiers: getVideoAssetIdentifiers(state),
    arePermissionsGranted: arePermissionsGranted(state),
    isCameraRecording: isCameraRecording(state),
    currentVideo: getCurrentVideo(state),
    fontFamily: getFontFamily(state),
    speechTranscriptions: getSpeechTranscriptions(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    loadVideoAssets: () => dispatch(loadVideoAssets()),
    beginCameraCapture: () => dispatch(beginCameraCapture()),
    endCameraCapture: () => dispatch(endCameraCapture()),
    beginSpeechTranscriptionWithAudioSession: () =>
      dispatch(beginSpeechTranscriptionWithAudioSession()),
    endSpeechTranscriptionWithAudioSession: () =>
      dispatch(endSpeechTranscriptionWithAudioSession()),
    receiveSpeechTranscriptionSuccess: (
      id: VideoAssetIdentifier,
      transcription: SpeechTranscription
    ) => dispatch(receiveSpeechTranscriptionSuccess(id, transcription)),
    receiveSpeechTranscriptionFailure: (id: VideoAssetIdentifier) =>
      dispatch(receiveSpeechTranscriptionFailure(id)),
    receiveFinishedVideo: (id: VideoAssetIdentifier) =>
      dispatch(receiveFinishedVideo(id)),
  };
}

// $FlowFixMe
@requireOnboardedUser
@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class HomeScreen extends Component<Props, State> {
  state = {
    currentVideoIdentifier: null,
  };
  scrollView: ?ScrollView;
  cameraView: ?CameraPreviewView;

  // eslint-disable-next-line flowtype/generic-spacing
  didReceiveSpeechTranscriptionSubscription: ?Return<
    typeof SpeechManager.addDidReceiveSpeechTranscriptionListener
  >;

  // eslint-disable-next-line flowtype/generic-spacing
  didNotDetectSpeechSubscription: ?Return<
    typeof SpeechManager.addDidNotDetectSpeechListener
  >;

  // eslint-disable-next-line flowtype/generic-spacing
  cameraManagerDidFinishFileOutputListener: ?Return<
    typeof Camera.addDidFinishFileOutputListener
  >;

  componentDidMount() {
    if (this.props.arePermissionsGranted) {
      this.setupAfterOnboarding();
    }
  }

  async componentWillUnmount() {
    await this.props.endCameraCapture();
    if (this.cameraManagerDidFinishFileOutputListener) {
      this.cameraManagerDidFinishFileOutputListener.remove();
    }
    if (this.didReceiveSpeechTranscriptionSubscription) {
      this.didReceiveSpeechTranscriptionSubscription.remove();
    }
    if (this.didNotDetectSpeechSubscription) {
      this.didNotDetectSpeechSubscription.remove();
    }
  }

  async componentDidUpdate(prevProps: Props) {
    if (!prevProps.arePermissionsGranted && this.props.arePermissionsGranted) {
      this.setupAfterOnboarding();
    }

    if (!prevProps.currentVideo && this.props.currentVideo) {
      const currentVideo = this.props.currentVideo;
      if (currentVideo) {
        await Screens.pushEditScreen(this.props.componentId, currentVideo);
      }
    }
  }

  async setupAfterOnboarding() {
    Camera.startPreview();
    MediaManager.startObservingVideos(this.mediaManagerDidUpdateVideos);
  }

  mediaManagerDidUpdateVideos({ videos }: { videos: [VideoAssetIdentifier] }) {
    console.log(videos);
  }

  async onDidPressVideoThumbnail(identifier: VideoAssetIdentifier) {
    await Screens.pushEditScreen(this.props.componentId, identifier);
  }

  async captureButtonDidRequestBeginCapture() {
    await this.startCapture();
  }

  async captureButtonDidRequestEndCapture() {
    await this.stopCapture();
  }

  async startCapture() {
    this.setState({ currentVideoIdentifier: uuid.v4() });
    this.cameraManagerDidFinishFileOutputListener = Camera.addDidFinishFileOutputListener(
      this.cameraManagerDidFinishFileOutput
    );
    await this.props.beginCameraCapture();
    this.didReceiveSpeechTranscriptionSubscription = SpeechManager.addDidReceiveSpeechTranscriptionListener(
      this.speechManagerDidReceiveSpeechTranscription
    );
    this.didNotDetectSpeechSubscription = SpeechManager.addDidNotDetectSpeechListener(
      () => {
        this.speechManagerDidNotDetectSpeech();
      }
    );
    await this.props.beginSpeechTranscriptionWithAudioSession();
  }

  async stopCapture() {
    if (!this.props.isCameraRecording) {
      Debug.logErrorMessage('Failed to stop capture, camera is not recording.');
      return;
    }
    await this.props.endSpeechTranscriptionWithAudioSession();
    await this.props.endCameraCapture();
  }

  speechManagerDidReceiveSpeechTranscription(
    transcription: SpeechTranscription
  ) {
    if (!this.props.isCameraRecording) {
      // Debug.logWarningMessage(
      //   'Received a speech transcription, but camera is not recording.'
      // );
      return;
    }
    if (!this.state.currentVideoIdentifier) {
      // Debug.logWarningMessage(
      //   'Received a speech transcription, but do not have an id for the current video.'
      // );
      return;
    }
    this.props.receiveSpeechTranscriptionSuccess(
      this.state.currentVideoIdentifier,
      transcription
    );
  }

  async speechManagerDidNotDetectSpeech() {
    // eslint-disable-next-line no-console
    console.log('speechManagerDidNotDetectSpeech');
    await this.props.endSpeechTranscriptionWithAudioSession();
  }

  cameraManagerDidFinishFileOutput(videoAssetIdentifier: VideoAssetIdentifier) {
    this.props.receiveFinishedVideo(videoAssetIdentifier);
  }

  scrollToCameraRoll() {
    if (!this.scrollView) {
      return;
    }
    this.scrollView.scrollTo({ y: SCREEN_HEIGHT });
  }

  tapToFocusDidReceiveFocusPoint(focusPoint: { x: number, y: number }) {
    if (!this.cameraView) {
      return;
    }
    this.cameraView.focusOnPoint(focusPoint);
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.flex}>
          <ScrollView
            ref={ref => {
              this.scrollView = ref;
            }}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            overScrollMode="always"
            keyboardDismissMode="on-drag"
            alwaysBounceVertical
            pagingEnabled
            contentInsetAdjustmentBehavior="never"
          >
            <SafeAreaView style={styles.flex}>
              <View style={styles.cameraPreview}>
                <CameraPreviewView
                  ref={ref => {
                    this.cameraView = ref;
                  }}
                  style={styles.flex}
                />
                <CameraTapToFocusView
                  style={styles.absoluteFill}
                  onDidRequestFocusOnPoint={this.tapToFocusDidReceiveFocusPoint}
                />
                <ScreenGradients />
                <LiveTranscriptionView
                  style={styles.transcript}
                  fontFamily={this.props.fontFamily}
                  speechTranscription={
                    this.state.currentVideoIdentifier
                      ? this.props.speechTranscriptions.get(
                          this.state.currentVideoIdentifier
                        )
                      : null
                  }
                />
                <HomeScreenCaptureControls
                  style={styles.captureControls}
                  onRequestBeginCapture={() => {
                    this.captureButtonDidRequestBeginCapture();
                  }}
                  onRequestEndCapture={() => {
                    this.captureButtonDidRequestEndCapture();
                  }}
                  onRequestOpenCameraRoll={this.scrollToCameraRoll}
                  onRequestSwitchCamera={Camera.switchToOppositeCamera}
                  videoAssetIdentifier={this.props.videoAssetIdentifiers[0]}
                />
              </View>
            </SafeAreaView>
            <SafeAreaView style={styles.flex}>
              <View style={styles.mediaHeader}>
                <Text style={styles.mediaText}>Camera Roll</Text>
              </View>
              <ScrollView
                style={styles.flex}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                contentInsetAdjustmentBehavior="never"
                overScrollMode="always"
                alwaysBounceVertical
              >
                <VideoThumbnailGrid
                  style={styles.flex}
                  videoAssetIdentifiers={this.props.videoAssetIdentifiers}
                  onPressThumbnail={(...args) => {
                    this.onDidPressVideoThumbnail(...args);
                  }}
                />
              </ScrollView>
            </SafeAreaView>
          </ScrollView>
        </View>
      </View>
    );
  }
}
