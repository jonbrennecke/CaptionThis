// @flow
import React, { Component } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';
import { autobind } from 'core-decorators';
import { Camera } from '@jonbrennecke/react-native-camera';

import ScreenGradients from '../../components/screen-gradients/ScreenGradients';
import HomeScreenCameraControls from './HomeScreenCameraControls';
import CameraTapToFocusView from '../../components/camera-tap-to-focus-view/CameraTapToFocusView';

import type { CameraPosition } from '@jonbrennecke/react-native-camera';

import type { VideoAssetIdentifier } from '../../types/media';
import type { LocaleObject, SpeechTranscription } from '../../types/speech';
import type { Style } from '../../types/react';
import type {
  CaptionStyleObject,
  CaptionPresetStyleObject,
} from '../../types/video';

type Props = {
  style?: ?Style,
  captionStyle: CaptionStyleObject,
  cameraPosition: ?CameraPosition,
  animatedScrollValue: Animated.Value,
  thumbnailVideoID: ?VideoAssetIdentifier,
  speechTranscription: ?SpeechTranscription,
  isCameraRecording: boolean,
  hasCompletedSetupAfterOnboarding: boolean,
  locale: ?LocaleObject,
  onRequestOpenCameraRoll: () => void,
  onRequestOpenLocaleMenu: () => void,
  onRequestBeginCapture: () => void,
  onRequestEndCapture: () => void,
  onRequestSwitchToOppositeCamera: () => void,
  onRequestSetCaptionStyle: CaptionPresetStyleObject => void,
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
  absoluteFill: StyleSheet.absoluteFillObject,
};

// $FlowFixMe
@autobind
export default class HomeScreenCameraPreview extends Component<Props> {
  cameraView: ?Camera;

  tapToFocusDidReceiveFocusPoint(focusPoint: { x: number, y: number }) {
    if (!this.cameraView) {
      return;
    }
    this.cameraView.focusOnPoint(focusPoint);
  }

  render() {
    const textSegments =
      this.props.speechTranscription && this.props.isCameraRecording
        ? this.props.speechTranscription.segments.map(s => ({
            duration: s.duration,
            timestamp: s.timestamp,
            text: s.substring,
          }))
        : [];
    return (
      <Animated.View
        style={[
          styles.cameraPreview(this.props.animatedScrollValue),
          this.props.style,
        ]}
      >
        <Camera
          style={styles.absoluteFill}
          ref={ref => {
            this.cameraView = ref;
          }}
          cameraPosition={this.props.cameraPosition || 'front'}
          previewMode="normal"
          resizeMode="scaleAspectFill"
        />
        <CameraTapToFocusView
          style={styles.absoluteFill}
          onDidRequestFocusOnPoint={this.tapToFocusDidReceiveFocusPoint}
        />
        <ScreenGradients />
        <HomeScreenCameraControls
          style={styles.absoluteFill}
          isVisible={this.props.hasCompletedSetupAfterOnboarding}
          countryCode={this.props.locale?.country.code}
          video={this.props.thumbnailVideoID}
          textSegments={textSegments}
          captionStyle={this.props.captionStyle}
          onRequestBeginCapture={this.props.onRequestBeginCapture}
          onRequestEndCapture={this.props.onRequestEndCapture}
          onRequestOpenCameraRoll={this.props.onRequestOpenCameraRoll}
          onRequestSwitchCamera={this.props.onRequestSwitchToOppositeCamera}
          onRequestOpenLocaleMenu={this.props.onRequestOpenLocaleMenu}
          onRequestSetCaptionStyle={this.props.onRequestSetCaptionStyle}
        />
      </Animated.View>
    );
  }
}
