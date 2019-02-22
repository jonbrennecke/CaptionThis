// @flow
import React, { Component } from 'react';
import {
  Animated,
  View,
  ScrollView,
  Dimensions,
  Text,
  StyleSheet,
} from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
// $FlowFixMe
import { withSafeArea } from 'react-native-safe-area';
import uuid from 'uuid';
import { Navigation } from 'react-native-navigation';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import * as Screens from '../../utils/Screens';
import * as Camera from '../../utils/Camera';
import * as Debug from '../../utils/Debug';
import MediaManager from '../../utils/MediaManager';
import SpeechManager from '../../utils/SpeechManager';
import requireOnboardedUser from '../onboarding/requireOnboardedUser';
import { arePermissionsGranted } from '../../redux/onboarding/selectors';
import {
  receiveVideos,
  beginCameraCapture,
  endCameraCapture,
  receiveFinishedVideo,
} from '../../redux/media/actionCreators';
import {
  beginSpeechTranscriptionWithAudioSession,
  endSpeechTranscriptionWithAudioSession,
  receiveSpeechTranscriptionFailure,
  receiveSpeechTranscriptionSuccess,
  setLocale,
  receiveLocale,
} from '../../redux/speech/actionCreators';
import { loadDeviceInfo } from '../../redux/device/actionCreators';
import {
  getVideos,
  isCameraRecording,
  getCurrentVideo,
} from '../../redux/media/selectors';
import { getFontFamily } from '../../redux/video/selectors';
import { getSpeechTranscriptions } from '../../redux/speech/selectors';
import CameraPreviewView from '../../components/camera-preview-view/CameraPreviewView';
import VideoThumbnailGrid from '../../components/video-thumbnail-grid/VideoThumbnailGrid';
import ScreenGradients from '../../components/screen-gradients/ScreenGradients';
import HomeScreenCameraControls from './HomeScreenCameraControls';
import LiveTranscriptionView from '../../components/live-transcription-view/LiveTranscriptionView';
import CameraTapToFocusView from '../../components/camera-tap-to-focus-view/CameraTapToFocusView';
import LocaleMenu from '../../components/localization/LocaleMenu';

import type { EmitterSubscription } from '../../types/react';
import type { Dispatch, AppState } from '../../types/redux';
import type { VideoAssetIdentifier, VideoObject } from '../../types/media';
import type { SpeechTranscription, LocaleObject } from '../../types/speech';
import type { Return } from '../../types/util';

type State = {
  currentVideoIdentifier: ?VideoAssetIdentifier,
  hasCompletedSetupAfterOnboarding: boolean,
  isLocaleMenuVisible: boolean,
};

type OwnProps = {
  componentId: string,
};

type StateProps = {
  videos: VideoObject[],
  arePermissionsGranted: boolean,
  isCameraRecording: boolean,
  currentVideo: ?VideoAssetIdentifier,
  fontFamily: string,
  speechTranscriptions: Return<typeof getSpeechTranscriptions>,
};

type DispatchProps = {
  receiveLocale: (locale: string) => Promise<void>,
  setLocale: (locale: string) => Promise<void>,
  loadDeviceInfo: () => Promise<void>,
  receiveVideos: (videos: VideoObject[]) => Promise<void>,
  beginCameraCapture: () => Promise<void>,
  endCameraCapture: () => Promise<void>,
  beginSpeechTranscriptionWithAudioSession: () => Promise<void>,
  endSpeechTranscriptionWithAudioSession: () => Promise<void>,
  receiveSpeechTranscriptionSuccess: (
    VideoAssetIdentifier,
    SpeechTranscription
  ) => void,
  receiveSpeechTranscriptionFailure: VideoAssetIdentifier => void,
  receiveFinishedVideo: VideoObject => void,
};

type Props = OwnProps & StateProps & DispatchProps;

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const SafeAreaView = withSafeArea(View, 'padding', 'vertical');

const styles = {
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.BLACK,
  },
  cameraPreview: (anim: Animated.Value) => ({
    borderRadius: 10,
    flex: 1,
    overflow: 'hidden',
    opacity: anim.interpolate({
      inputRange: [0, SCREEN_HEIGHT],
      outputRange: [1, 0],
    }),
  }),
  mediaHeader: {
    paddingVertical: 5,
    paddingHorizontal: 7,
    alignItems: 'flex-start',
  },
  mediaText: Fonts.getFontStyle('title', { contentStyle: 'lightContent' }),
  flex: {
    flex: 1,
  },
  captureControls: StyleSheet.absoluteFillObject,
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
    videos: getVideos(state),
    arePermissionsGranted: arePermissionsGranted(state),
    isCameraRecording: isCameraRecording(state),
    currentVideo: getCurrentVideo(state),
    fontFamily: getFontFamily(state),
    speechTranscriptions: getSpeechTranscriptions(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    receiveLocale: (locale: string) => dispatch(receiveLocale(locale)),
    setLocale: (locale: string) => dispatch(setLocale(locale)),
    loadDeviceInfo: () => dispatch(loadDeviceInfo()),
    receiveVideos: (videos: VideoObject[]) => dispatch(receiveVideos(videos)),
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
    receiveFinishedVideo: (video: VideoObject) =>
      dispatch(receiveFinishedVideo(video)),
  };
}

// $FlowFixMe
@requireOnboardedUser
@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class HomeScreen extends Component<Props, State> {
  state = {
    currentVideoIdentifier: null,
    hasCompletedSetupAfterOnboarding: false,
    isLocaleMenuVisible: false,
  };
  navigationEventListener: ?any;
  scrollView: ?ScrollView;
  cameraView: ?CameraPreviewView;
  scrollAnim = new Animated.Value(0);
  mediaLibrarySubscription: ?EmitterSubscription;
  speechManagerDidReceiveTranscriptionListener: EmitterSubscription;
  speechManagerDidNotDetectSpeechListener: ?EmitterSubscription;
  speechManagerDidChangeLocaleListener: ?EmitterSubscription;
  cameraManagerDidFinishFileOutputListener: ?EmitterSubscription;

  async componentDidMount() {
    this.navigationEventListener = Navigation.events().bindComponent(this);
    if (this.props.arePermissionsGranted) {
      this.setupAfterOnboarding();
    }
  }

  async componentWillUnmount() {
    await this.props.endCameraCapture();
    MediaManager.stopObservingVideos();
    if (this.cameraManagerDidFinishFileOutputListener) {
      this.cameraManagerDidFinishFileOutputListener.remove();
    }
    if (this.navigationEventListener) {
      this.navigationEventListener.remove();
    }
    this.removeSpeechListeners();
  }

  async componentDidUpdate(prevProps: Props) {
    if (!prevProps.arePermissionsGranted && this.props.arePermissionsGranted) {
      await this.setupAfterOnboarding();
    }
  }

  componentDidAppear() {
    Camera.startPreview();
  }

  componentDidDisappear() {
    Camera.stopPreview();
  }

  async setupAfterOnboarding() {
    if (this.state.hasCompletedSetupAfterOnboarding) {
      return;
    }
    Camera.startPreview();
    if (this.cameraView) {
      this.cameraView.setUp();
    }
    await this.setUpSpeechRecognizer();
    await this.loadMediaLibrary();
    await this.props.loadDeviceInfo();
    this.setState({
      hasCompletedSetupAfterOnboarding: true,
    });
  }

  async loadMediaLibrary() {
    if (this.mediaLibrarySubscription) {
      return;
    }
    this.mediaLibrarySubscription = MediaManager.startObservingVideos(
      videos => {
        this.mediaManagerDidUpdateVideos(videos);
      }
    );
    const videos = await MediaManager.getVideoAssets();
    await this.props.receiveVideos(videos);
  }

  async mediaManagerDidUpdateVideos({ videos }: { videos: VideoObject[] }) {
    await this.props.receiveVideos(videos);
  }

  async onDidPressVideoThumbnail(video: VideoObject) {
    await this.pushEditScreen(video);
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
      (...args) => {
        this.cameraManagerDidFinishFileOutput(...args);
      }
    );
    await this.props.beginCameraCapture();
    this.addSpeechListeners();
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

  async setUpSpeechRecognizer() {
    this.speechManagerDidChangeLocaleListener = SpeechManager.addDidChangeLocaleListener(
      this.speechManagerDidChangeLocale
    );
    const locale = await SpeechManager.currentLocale();
    const localeIdentifier = `${locale.language.code}-${locale.country.code}`;
    this.props.receiveLocale(localeIdentifier);
  }

  async setUpSpeechRecognizerForRecording() {

  }

  addSpeechListeners() {
    this.speechManagerDidReceiveTranscriptionListener = SpeechManager.addDidReceiveSpeechTranscriptionListener(
      this.speechManagerDidReceiveSpeechTranscription
    );
    this.speechManagerDidNotDetectSpeechListener = SpeechManager.addDidNotDetectSpeechListener(
      () => {
        this.speechManagerDidNotDetectSpeech();
      }
    );
  }

  removeSpeechListeners() {
    this.speechManagerDidReceiveTranscriptionListener && this.speechManagerDidReceiveTranscriptionListener.remove();
    this.speechManagerDidReceiveTranscriptionListener = null;
    this.speechManagerDidNotDetectSpeechListener && this.speechManagerDidNotDetectSpeechListener.remove();
    this.speechManagerDidNotDetectSpeechListener = null;
    this.speechManagerDidChangeLocaleListener && this.speechManagerDidChangeLocaleListener.remove();
    this.speechManagerDidChangeLocaleListener = null;
  }

  speechManagerDidChangeLocale(localeIdentifier: string) {
    this.props.receiveLocale(localeIdentifier);
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
    await this.props.endSpeechTranscriptionWithAudioSession();
  }

  async cameraManagerDidFinishFileOutput(video: VideoObject) {
    Debug.log('Camera finished saving video file.');
    this.props.receiveFinishedVideo(video);
    if (this.cameraManagerDidFinishFileOutputListener) {
      this.cameraManagerDidFinishFileOutputListener.remove();
    }
    await this.pushEditScreen(video);
  }

  async pushEditScreen(video: VideoObject) {
    await Screens.pushEditScreen(this.props.componentId, video);
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

  onRequestOpenLocaleMenu() {
    this.setState({
      isLocaleMenuVisible: true,
    });
  }

  onRequestDismissLocaleMenu() {
    this.setState({
      isLocaleMenuVisible: false,
    });
  }

  async onRequestChangeLocale(locale: LocaleObject) {
    const localeIdentifier = `${locale.language.code}-${locale.country.code}`;
    await this.props.setLocale(localeIdentifier);
  }

  render() {
    const onScroll = Animated.event([
      {
        nativeEvent: {
          contentOffset: {
            y: this.scrollAnim,
          },
        },
      },
    ]);
    return (
      <View style={styles.container}>
        <View style={styles.flex}>
          <ScrollView
            ref={ref => {
              this.scrollView = ref;
            }}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="always"
            overScrollMode="always"
            keyboardDismissMode="on-drag"
            alwaysBounceVertical
            pagingEnabled
            contentInsetAdjustmentBehavior="never"
            onScroll={onScroll}
          >
            <SafeAreaView style={styles.flex}>
              <Animated.View style={styles.cameraPreview(this.scrollAnim)}>
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
                  isCameraRecording={this.props.isCameraRecording}
                  speechTranscription={
                    this.state.currentVideoIdentifier
                      ? this.props.speechTranscriptions.get(
                          this.state.currentVideoIdentifier
                        )
                      : null
                  }
                />
                <HomeScreenCameraControls
                  style={styles.captureControls}
                  isVisible={this.state.hasCompletedSetupAfterOnboarding}
                  video={this.props.videos[0]?.id}
                  onRequestBeginCapture={() => {
                    this.captureButtonDidRequestBeginCapture();
                  }}
                  onRequestEndCapture={() => {
                    this.captureButtonDidRequestEndCapture();
                  }}
                  onRequestOpenCameraRoll={this.scrollToCameraRoll}
                  onRequestSwitchCamera={Camera.switchToOppositeCamera}
                  onRequestOpenLocaleMenu={this.onRequestOpenLocaleMenu}
                />
              </Animated.View>
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
                  videos={this.props.videos}
                  onPressThumbnail={video => {
                    this.onDidPressVideoThumbnail(video);
                  }}
                />
              </ScrollView>
            </SafeAreaView>
          </ScrollView>
        </View>
        <LocaleMenu
          isVisible={this.state.isLocaleMenuVisible}
          onRequestDismiss={this.onRequestDismissLocaleMenu}
          onRequestChangeLocale={this.onRequestChangeLocale}
        />
      </View>
    );
  }
}
