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
// $FlowFixMe
import { withSafeArea } from 'react-native-safe-area';
import uuid from 'uuid';
import { Navigation } from 'react-native-navigation';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import * as Screens from '../../utils/Screens';
import * as Camera from '../../utils/Camera';
import * as Debug from '../../utils/Debug';
import { getLocaleID } from '../../utils/Localization';
import MediaManager from '../../utils/MediaManager';
import SpeechManager from '../../utils/SpeechManager';
import requireOnboardedUser from '../onboarding/requireOnboardedUser';
import VideoThumbnailGrid from '../../components/video-thumbnail-grid/VideoThumbnailGrid';
import LocaleMenu from '../../components/localization/LocaleMenu';
import HomeScreenCameraPreview from './HomeScreenCameraPreview';
import Container from './Container';

import type { EmitterSubscription } from '../../types/react';
import type { Props } from './Container';
import type { VideoAssetIdentifier, VideoObject } from '../../types/media';
import type { SpeechTranscription, LocaleObject } from '../../types/speech';

type State = {
  videoID: ?VideoAssetIdentifier,
  hasCompletedSetupAfterOnboarding: boolean,
  isLocaleMenuVisible: boolean,
};

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const SafeAreaView = withSafeArea(View, 'padding', 'vertical');

const styles = {
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.BLACK,
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
  scrollView: {
    flex: 1,
    overflow: 'visible',
  },
  scrollViewContent: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 2,
  },
  absoluteFill: StyleSheet.absoluteFill,
};

// $FlowFixMe
@requireOnboardedUser
@Container
@autobind
export default class HomeScreen extends Component<Props, State> {
  state = {
    videoID: null,
    hasCompletedSetupAfterOnboarding: false,
    isLocaleMenuVisible: false,
  };
  navigationEventListener: ?any;
  scrollView: ?ScrollView;
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
    this.shutDownSpeechRecognizer();
  }

  async componentDidUpdate(prevProps: Props) {
    if (!prevProps.arePermissionsGranted && this.props.arePermissionsGranted) {
      await this.setupAfterOnboarding();
    }
  }

  async componentDidAppear() {
    Camera.startPreview();
    await this.setUpSpeechRecognizer();
  }

  async componentDidDisappear() {
    Camera.stopPreview();
    await this.shutDownSpeechRecognizer();
  }

  async setupAfterOnboarding() {
    if (this.state.hasCompletedSetupAfterOnboarding) {
      return;
    }
    Camera.startPreview();
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
    this.setState({ videoID: uuid.v4() });
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
    this.removeSpeechListeners();
  }

  async setUpSpeechRecognizer() {
    this.speechManagerDidChangeLocaleListener = SpeechManager.addDidChangeLocaleListener(
      this.speechManagerDidChangeLocale
    );
    await this.props.loadCurrentLocale();
  }

  async shutDownSpeechRecognizer() {
    this.speechManagerDidChangeLocaleListener &&
      this.speechManagerDidChangeLocaleListener.remove();
    this.speechManagerDidChangeLocaleListener = null;
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
    this.speechManagerDidReceiveTranscriptionListener &&
      this.speechManagerDidReceiveTranscriptionListener.remove();
    this.speechManagerDidReceiveTranscriptionListener = null;
    this.speechManagerDidNotDetectSpeechListener &&
      this.speechManagerDidNotDetectSpeechListener.remove();
    this.speechManagerDidNotDetectSpeechListener = null;
  }

  speechManagerDidChangeLocale(locale: LocaleObject) {
    if (
      this.props.locale &&
      // $FlowFixMe
      getLocaleID(locale) === getLocaleID(this.props.locale)
    ) {
      return;
    }
    this.props.receiveLocale(locale);
  }

  speechManagerDidReceiveSpeechTranscription(
    transcription: SpeechTranscription
  ) {
    if (!this.state.videoID) {
      return;
    }
    this.props.receiveSpeechTranscriptionSuccess(
      this.state.videoID,
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
    await this.props.setLocale(locale);
    this.setState({
      isLocaleMenuVisible: false,
    });
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
              <HomeScreenCameraPreview
                style={styles.flex}
                locale={this.props.locale}
                captionStyle={this.props.captionStyle}
                animatedScrollValue={this.scrollAnim}
                isCameraRecording={this.props.isCameraRecording}
                thumbnailVideoID={this.props.videos[0]?.id}
                hasCompletedSetupAfterOnboarding={
                  this.state.hasCompletedSetupAfterOnboarding
                }
                speechTranscription={
                  this.state.videoID
                    ? this.props.speechTranscriptions.get(this.state.videoID)
                    : null
                }
                onRequestOpenCameraRoll={this.scrollToCameraRoll}
                onRequestOpenLocaleMenu={this.onRequestOpenLocaleMenu}
                onRequestBeginCapture={() => {
                  this.captureButtonDidRequestBeginCapture();
                }}
                onRequestEndCapture={() => {
                  this.captureButtonDidRequestEndCapture();
                }}
                onRequestSetCaptionStyle={captionStyle => {
                  this.props.updateCaptionStyle(captionStyle);
                }}
              />
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
          locale={this.props.locale}
          onRequestDismiss={this.onRequestDismissLocaleMenu}
          onRequestChangeLocale={l => {
            this.onRequestChangeLocale(l);
          }}
        />
      </View>
    );
  }
}
