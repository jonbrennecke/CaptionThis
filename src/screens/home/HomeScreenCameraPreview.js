// @flow
import React, { Component } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';

import * as Camera from '../../utils/Camera';
import ScreenGradients from '../../components/screen-gradients/ScreenGradients';
import HomeScreenCameraControls from './HomeScreenCameraControls';
import LiveTranscriptionView from '../../components/live-transcription-view/LiveTranscriptionView';
import CameraTapToFocusView from '../../components/camera-tap-to-focus-view/CameraTapToFocusView';
import CameraPreviewView from '../../components/camera-preview-view/CameraPreviewView';

import type { VideoAssetIdentifier } from '../../types/media';
import type { LocaleObject, SpeechTranscription } from '../../types/speech';
import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  animatedScrollValue: Animated.Value,
  fontFamily: string,
  thumbnailVideoID: ?VideoAssetIdentifier,
  speechTranscription: ?SpeechTranscription,
  isCameraRecording: boolean,
  hasCompletedSetupAfterOnboarding: boolean,
  locale: ?LocaleObject,
  onRequestOpenCameraRoll: () => void,
  onRequestOpenLocaleMenu: () => void,
  onRequestBeginCapture: () => void,
  onRequestEndCapture: () => void,
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = {
  cameraPreview: (anim: Animated.Value) => ({
    borderRadius: 10,
    overflow: 'hidden',
    opacity: anim.interpolate({
      inputRange: [0, SCREEN_HEIGHT],
      outputRange: [1, 0],
    }),
  }),
  flex: {
    flex: 1,
  },
  absoluteFill: StyleSheet.absoluteFillObject,
  transcript: {
    position: 'absolute',
    bottom: 125,
    left: 0,
    right: 0,
  },
};

export default class HomeScreenCameraPreview extends Component<Props> {
  cameraView: ?CameraPreviewView;

  tapToFocusDidReceiveFocusPoint(focusPoint: { x: number, y: number }) {
    if (!this.cameraView) {
      return;
    }
    this.cameraView.focusOnPoint(focusPoint);
  }

  render() {
    return (
      <Animated.View style={[styles.cameraPreview(this.props.animatedScrollValue), this.props.style]}>
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
          speechTranscription={this.props.speechTranscription}
        />
        <HomeScreenCameraControls
          style={styles.absoluteFill}
          isVisible={this.props.hasCompletedSetupAfterOnboarding}
          countryCode={this.props.locale?.country.code}
          video={this.props.thumbnailVideoID}
          onRequestBeginCapture={this.props.onRequestBeginCapture}
          onRequestEndCapture={this.props.onRequestEndCapture}
          onRequestOpenCameraRoll={this.props.onRequestOpenCameraRoll}
          onRequestSwitchCamera={Camera.switchToOppositeCamera}
          onRequestOpenLocaleMenu={this.props.onRequestOpenLocaleMenu}
        />
      </Animated.View>
    );
  }
}