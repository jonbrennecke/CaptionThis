// @flow
import React, { Component } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';
import { autobind } from 'core-decorators';

import * as Color from '../../utils/Color';
import * as Camera from '../../utils/Camera';
import { USER_BACKGROUND_COLOR_CHOICES } from '../../constants';
import ScreenGradients from '../../components/screen-gradients/ScreenGradients';
import HomeScreenCameraControls from './HomeScreenCameraControls';
import CaptionView from '../../components/caption-view/CaptionView';
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

// $FlowFixMe
@autobind
export default class HomeScreenCameraPreview extends Component<Props> {
  cameraView: ?CameraPreviewView;

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.hasCompletedSetupAfterOnboarding &&
      !prevProps.hasCompletedSetupAfterOnboarding
    ) {
      if (this.cameraView) {
        this.cameraView.setUp();
      }
    }
  }

  tapToFocusDidReceiveFocusPoint(focusPoint: { x: number, y: number }) {
    if (!this.cameraView) {
      return;
    }
    this.cameraView.focusOnPoint(focusPoint);
  }

  render() {
    const textSegments = this.props.speechTranscription ? this.props.speechTranscription.segments.map(s => ({
      duration: s.duration,
      timestamp: s.timestamp,
      text: s.substring,
    })) : [];
    return (
      <Animated.View
        style={[
          styles.cameraPreview(this.props.animatedScrollValue),
          this.props.style,
        ]}
      >
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
        <CaptionView
          duration={10}
          textSegments={textSegments}
          captionStyle={{
            textAlignment: 'center',
            lineStyle: 'fadeInOut',
            wordStyle: 'none',
            backgroundStyle: 'solid',
            backgroundColor: Color.hexToRgbaObject(USER_BACKGROUND_COLOR_CHOICES[1]),
          }}
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
