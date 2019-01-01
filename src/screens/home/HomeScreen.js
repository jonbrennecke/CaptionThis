// @flow
import React, { Component } from 'react';
import { View, ScrollView, SafeAreaView, Dimensions, Text } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import * as Screens from '../../utils/Screens';
import * as Camera from '../../utils/Camera';
import * as Debug from '../../utils/Debug';
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
} from '../../redux/media/selectors';
import CameraPreviewView from '../../components/camera-preview-view/CameraPreviewView';
import VideoThumbnailGrid from '../../components/video-thumbnail-grid/VideoThumbnailGrid';
import ScreenGradients from '../../components/screen-gradients/ScreenGradients';
import HomeScreenCaptureControls from './HomeScreenCaptureControls';

import type { Dispatch, AppState } from '../../types/redux';
import type { VideoAssetIdentifier } from '../../types/media';
import type { SpeechTranscription } from '../../types/speech';
import type { Return } from '../../types/util';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

type OwnProps = {
  componentId: string,
};

type StateProps = {
  videoAssetIdentifiers: VideoAssetIdentifier[],
  arePermissionsGranted: boolean,
  isCameraRecording: boolean,
  currentVideo: ?VideoAssetIdentifier,
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

const styles = {
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.BLACK,
  },
  cameraPreview: {
    borderRadius: 10,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 125,
    overflow: 'hidden',
    backgroundColor: 'red',
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
  fill: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 50,
  },
  fill2: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  scrollView: {
    flex: 1,
    overflow: 'visible',
  },
};

function mapStateToProps(state: AppState): StateProps {
  return {
    videoAssetIdentifiers: getVideoAssetIdentifiers(state),
    arePermissionsGranted: arePermissionsGranted(state),
    isCameraRecording: isCameraRecording(state),
    currentVideo: getCurrentVideo(state),
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
export default class HomeScreen extends Component<Props> {
  scrollView: ?ScrollView;

  // eslint-disable-next-line flowtype/generic-spacing
  speechTranscriptionSubscription: ?Return<
    typeof SpeechManager.addSpeechTranscriptionListener
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
    if (this.speechTranscriptionSubscription) {
      this.speechTranscriptionSubscription.remove();
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
    await this.props.loadVideoAssets();
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
    this.cameraManagerDidFinishFileOutputListener = Camera.addDidFinishFileOutputListener(
      this.cameraManagerDidFinishFileOutput
    );
    await this.props.beginCameraCapture();
    this.speechTranscriptionSubscription = SpeechManager.addSpeechTranscriptionListener(
      this.speechManagerDidReceiveSpeechTranscription
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
      Debug.logWarningMessage(
        'Received a speech transcription, but camera is not recording.'
      );
      return;
    }
    const currentVideo = this.props.currentVideo;
    if (!currentVideo) {
      // TODO: this.props.receiveSpeechTranscriptionFailure();
      return;
    }
    this.props.receiveSpeechTranscriptionSuccess(currentVideo, transcription);
  }

  cameraManagerDidFinishFileOutput(videoAssetIdentifier: VideoAssetIdentifier) {
    this.props.receiveFinishedVideo(videoAssetIdentifier);
  }

  async scrollToCameraRoll() {
    const constants = await Navigation.constants();
    const { topBarHeight, statusBarHeight } = constants;
    if (!this.scrollView) {
      return;
    }
    this.scrollView.scrollTo({
      y: SCREEN_HEIGHT - topBarHeight - statusBarHeight,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScreenGradients />
        <SafeAreaView style={styles.flex}>
          <ScrollView
            ref={ref => {
              this.scrollView = ref;
            }}
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            contentInsetAdjustmentBehavior="automatic"
            overScrollMode="always"
            alwaysBounceVertical
            pagingEnabled
          >
            <View style={styles.fill}>
              <View style={styles.cameraPreview}>
                <CameraPreviewView style={styles.flex} />
                <HomeScreenCaptureControls
                  style={styles.captureControls}
                  onRequestBeginCapture={() => {
                    this.captureButtonDidRequestBeginCapture();
                  }}
                  onRequestEndCapture={() => {
                    this.captureButtonDidRequestEndCapture();
                  }}
                  onRequestOpenCameraRoll={() => {
                    this.scrollToCameraRoll();
                  }}
                  onRequestSwitchCamera={Camera.switchToOppositeCamera}
                  videoAssetIdentifier={this.props.videoAssetIdentifiers[0]}
                />
              </View>
            </View>
            <View style={styles.fill2}>
              <View style={styles.mediaHeader}>
                <Text style={styles.mediaText}>CAMERA ROLL</Text>
              </View>
              <ScrollView
                style={styles.flex}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                contentInsetAdjustmentBehavior="automatic"
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
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
