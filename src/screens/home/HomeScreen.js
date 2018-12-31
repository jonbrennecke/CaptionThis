// @flow
import React, { Component } from 'react';
import { View, ScrollView, SafeAreaView, Dimensions, Text } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

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
} from '../../redux/media/actionCreators';
import {
  getVideoAssetIdentifiers,
  isCameraRecording,
  getCameraRecordingState,
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
  cameraRecordingState: ?{ videoAssetIdentifier: VideoAssetIdentifier },
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
  },
  mediaHeader: {
    paddingVertical: 5,
    alignItems: 'center',
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
};

function mapStateToProps(state: AppState): StateProps {
  return {
    videoAssetIdentifiers: getVideoAssetIdentifiers(state),
    arePermissionsGranted: arePermissionsGranted(state),
    isCameraRecording: isCameraRecording(state),
    cameraRecordingState: getCameraRecordingState(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
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
  };
}

// $FlowFixMe
@requireOnboardedUser
@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class HomeScreen extends Component<Props> {
  // eslint-disable-next-line flowtype/generic-spacing
  speechTranscriptionSubscription: ?Return<
    typeof SpeechManager.addSpeechTranscriptionListener
  >;

  componentDidMount() {
    if (this.props.arePermissionsGranted) {
      this.setupAfterOnboarding();
    }
  }

  async componentWillUnmount() {
    await this.stopCapture();
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.arePermissionsGranted && this.props.arePermissionsGranted) {
      this.setupAfterOnboarding();
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
    await this.props.beginCameraCapture();
    SpeechManager.addSpeechTranscriptionListener(
      this.speechManagerDidReceiveSpeechTranscription
    );
    await this.props.beginSpeechTranscriptionWithAudioSession();
  }

  async stopCapture() {
    await this.props.endSpeechTranscriptionWithAudioSession();
    if (this.speechTranscriptionSubscription) {
      SpeechManager.removeListener(this.speechTranscriptionSubscription);
    }
    if (!this.props.cameraRecordingState) {
      Debug.logErrorMessage(
        'Received a speech transcription, but camera is not recording.'
      );
      return;
    }
    const { videoAssetIdentifier: id } = this.props.cameraRecordingState;
    await Screens.pushEditScreen(this.props.componentId, id);
    await this.props.endCameraCapture();
  }

  speechManagerDidReceiveSpeechTranscription(
    transcription: SpeechTranscription
  ) {
    if (!this.props.cameraRecordingState) {
      Debug.logErrorMessage(
        'Received a speech transcription, but camera is not recording.'
      );
      return;
    }
    const { videoAssetIdentifier } = this.props.cameraRecordingState;
    if (!transcription) {
      this.props.receiveSpeechTranscriptionFailure(videoAssetIdentifier);
      return;
    }
    this.props.receiveSpeechTranscriptionSuccess(
      videoAssetIdentifier,
      transcription
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ScreenGradients />
        <ScrollView
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentInsetAdjustmentBehavior="automatic"
          overScrollMode="always"
          alwaysBounceVertical
        >
          <SafeAreaView style={styles.flex}>
            <View style={styles.flex}>
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
                />
              </View>
              <View style={styles.flex}>
                <View style={styles.mediaHeader}>
                  <Text style={styles.mediaText}>VIDEOS</Text>
                </View>
                <VideoThumbnailGrid
                  style={styles.flex}
                  videoAssetIdentifiers={this.props.videoAssetIdentifiers}
                  onPressThumbnail={(...args) => {
                    this.onDidPressVideoThumbnail(...args);
                  }}
                />
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
    );
  }
}
