// @flow
import React, { PureComponent } from 'react';
import { Animated, View, ScrollView, Dimensions } from 'react-native';
import { autobind } from 'core-decorators';
// $FlowFixMe
import { withSafeArea } from 'react-native-safe-area';
import uuid from 'uuid';
import { createAssetWithVideoFileAtURL } from '@jonbrennecke/react-native-media';
import {
  beginSpeechTranscriptionOfAudioSession,
  endSpeechTranscriptionOfAudioSession,
  setSpeechLocale,
  getLocaleID,
} from '@jonbrennecke/react-native-speech';

import { UI_COLORS, SCREENS } from '../../constants';
import * as Debug from '../../utils/Debug';
import requireOnboardedUser from '../onboarding/requireOnboardedUser';
import { MediaExplorer } from '../../components/media-explorer';
import LocaleMenu from '../../components/localization/LocaleMenu';
import HomeScreenCameraPreview from './HomeScreenCameraPreview';
import { wrapWithHomeScreenState } from './homeScreenState';

import type { MediaObject } from '@jonbrennecke/react-native-media';
import type { LocaleObject } from '@jonbrennecke/react-native-speech';

import type { HomeScreenStateProps } from './homeScreenState';
import type { VideoAssetIdentifier } from '../../types/media';

type HomeScreenProps = {
  navigation: any, // TODO
};

type HomeScreenState = {
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
// $FlowFixMe
@wrapWithHomeScreenState
// $FlowFixMe
@autobind
export default class HomeScreen extends PureComponent<
  HomeScreenProps & HomeScreenStateProps,
  HomeScreenState
> {
  state = {
    videoID: null,
    hasCompletedSetupAfterOnboarding: false,
    isLocaleMenuVisible: false,
  };
  navigationEventListener: ?any;
  scrollView: ?ScrollView;
  scrollAnim = new Animated.Value(0);

  async componentDidMount() {
    if (this.props.arePermissionsGranted) {
      this.setupAfterOnboarding();
    }
  }

  async componentWillUnmount() {
    if (this.props.captureStatus === 'started') {
      await this.stopCapture();
    }
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

  async setupAfterOnboarding() {
    if (this.state.hasCompletedSetupAfterOnboarding) {
      return;
    }
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
    const uniqueID = uuid.v4();
    this.setState({ videoID: uniqueID });
    await this.props.startCapture({});
    await beginSpeechTranscriptionOfAudioSession(uniqueID);
  }

  async stopCapture() {
    if (this.props.captureStatus !== 'started') {
      Debug.logErrorMessage('Failed to stop capture, camera is not recording.');
      return;
    }
    await endSpeechTranscriptionOfAudioSession();
    this.props.stopCapture({
      saveToCameraRoll: false,
    });
  }

  async pushEditScreen(video: MediaObject) {
    this.props.navigation.navigate(
      SCREENS.EDIT_SCREEN,
      {
        video,
      }
    );
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
    setSpeechLocale(getLocaleID(locale));
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
                cameraFormat={this.props.format}
                cameraPosition={this.props.cameraPosition}
                cameraResolutionPreset={
                  this.props.cameraResolutionPreset[
                    this.props.cameraPosition || 'front'
                  ]
                }
                cameraInitializationStatus={this.props.initializationStatus}
                captionStyle={this.props.captionStyle}
                animatedScrollValue={this.scrollAnim}
                isCameraRecording={this.props.captureStatus === 'started'}
                isCameraPaused={this.props.isCameraPaused}
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
                onRequestSwitchToOppositeCamera={
                  this.props.switchCameraPosition
                }
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
