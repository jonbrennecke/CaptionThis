// @flow
import React, { Component } from 'react';
import { Animated, View, ScrollView, Dimensions } from 'react-native';
import { autobind } from 'core-decorators';
// $FlowFixMe
import { withSafeArea } from 'react-native-safe-area';
import uuid from 'uuid';
import { Navigation } from 'react-native-navigation';
import {
  startCameraPreview,
  stopCameraPreview,
} from '@jonbrennecke/react-native-camera';
import { createAssetWithVideoFileAtURL } from '@jonbrennecke/react-native-media';

import { UI_COLORS } from '../../constants';
import * as Screens from '../../utils/Screens';
import * as Debug from '../../utils/Debug';
import { getLocaleID } from '../../utils/Localization';
import SpeechManager from '../../utils/SpeechManager';
import requireOnboardedUser from '../onboarding/requireOnboardedUser';
import { MediaExplorer } from '../../components/media-explorer';
import LocaleMenu from '../../components/localization/LocaleMenu';
import HomeScreenCameraPreview from './HomeScreenCameraPreview';
import { wrapWithHomeScreenState } from './homeScreenState';

import type { MediaObject } from '@jonbrennecke/react-native-media';

import type { EmitterSubscription } from '../../types/react';
import type { HomeScreenStateProps } from './homeScreenState';
import type { VideoAssetIdentifier } from '../../types/media';
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
};

// $FlowFixMe
@requireOnboardedUser
@wrapWithHomeScreenState
@autobind
export default class HomeScreen extends Component<HomeScreenStateProps, State> {
  state = {
    videoID: null,
    hasCompletedSetupAfterOnboarding: false,
    isLocaleMenuVisible: false,
  };
  navigationEventListener: ?any;
  scrollView: ?ScrollView;
  scrollAnim = new Animated.Value(0);
  speechManagerDidReceiveTranscriptionListener: EmitterSubscription;
  speechManagerDidNotDetectSpeechListener: ?EmitterSubscription;
  speechManagerDidChangeLocaleListener: ?EmitterSubscription;

  async componentDidMount() {
    this.navigationEventListener = Navigation.events().bindComponent(this);
    if (this.props.arePermissionsGranted) {
      this.setupAfterOnboarding();
    }
  }

  async componentWillUnmount() {
    if (this.props.captureStatus === 'started') {
      await this.stopCapture();
    }
    if (this.navigationEventListener) {
      this.navigationEventListener.remove();
    }
    this.removeSpeechListeners();
    this.shutDownSpeechRecognizer();
  }

  async componentDidUpdate(prevProps: HomeScreenStateProps) {
    if (!prevProps.arePermissionsGranted && this.props.arePermissionsGranted) {
      await this.setupAfterOnboarding();
    }

    if (
      this.props.lastCapturedVideoURL &&
      this.props.lastCapturedVideoURL !== prevProps.lastCapturedVideoURL
    ) {
      await this.saveCapturedVideo(this.props.lastCapturedVideoURL);
    }
  }

  async componentDidAppear() {
    startCameraPreview();
    await this.setUpSpeechRecognizer();
  }

  async componentDidDisappear() {
    stopCameraPreview();
    await this.shutDownSpeechRecognizer();
  }

  async setupAfterOnboarding() {
    if (this.state.hasCompletedSetupAfterOnboarding) {
      return;
    }
    startCameraPreview();
    await this.props.loadDeviceInfo();
    this.setState({
      hasCompletedSetupAfterOnboarding: true,
    });
  }

  async saveCapturedVideo(videoURL: string) {
    const asset = await createAssetWithVideoFileAtURL(videoURL);
    if (!asset) {
      Debug.logErrorMessage(`Failed create asset. URL = ${videoURL}`);
      return;
    }
    // TODO:
    // this.props.appendAssets({ assets: [asset] }));
    this.props.receiveFinishedVideo(asset);
    await this.pushEditScreen(asset);
  }

  async captureButtonDidRequestBeginCapture() {
    await this.startCapture();
  }

  async captureButtonDidRequestEndCapture() {
    await this.stopCapture();
  }

  async startCapture() {
    this.setState({ videoID: uuid.v4() });
    await this.props.startCapture({});
    this.addSpeechListeners();
    await this.props.beginSpeechTranscriptionWithAudioSession();
  }

  async stopCapture() {
    if (this.props.captureStatus !== 'started') {
      Debug.logErrorMessage('Failed to stop capture, camera is not recording.');
      return;
    }
    await this.props.endSpeechTranscriptionWithAudioSession();
    this.removeSpeechListeners();
    this.props.stopCapture({
      saveToCameraRoll: false
    });
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

  async pushEditScreen(video: MediaObject) {
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
                cameraPosition={this.props.cameraPosition}
                captionStyle={this.props.captionStyle}
                animatedScrollValue={this.scrollAnim}
                isCameraRecording={this.props.captureStatus === 'started'}
                thumbnailVideoID={this.props.thumbnailVideoID}
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
                onRequestSwitchToOppositeCamera={this.props.switchCameraPosition}
              />
            </SafeAreaView>
            <MediaExplorer
              onSelectVideo={video => {
                this.pushEditScreen(video);
              }}
            />
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
