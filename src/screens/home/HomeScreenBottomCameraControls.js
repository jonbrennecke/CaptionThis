// @flow
import React from 'react';

import CaptureButton from '../../components/capture-button/CaptureButton';
import SwitchCameraButton from '../../components/switch-camera-button/SwitchCameraButton';
import HomeScreenCameraRollButton from './HomeScreenCameraRollButton';
import SlideUpAnimatedView from '../../components/animations/SlideUpAnimatedView';

import type { Style } from '../../types/react';
import type { VideoAssetIdentifier } from '../../types/media';

type Props = {
  style?: ?Style,
  isVisible: boolean,
  onRequestBeginCapture: () => void,
  onRequestEndCapture: () => void,
  onRequestOpenCameraRoll: () => void,
  onRequestSwitchCamera: () => void,
  video: ?VideoAssetIdentifier,
};

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    flexDirection: 'row',
    paddingHorizontal: 35,
  },
  cameraRollButton: {
    height: 37,
    width: 37,
  },
  buttonInside: {
    flex: 1,
    borderRadius: 3,
    overflow: 'hidden',
  },
  switchCameraButton: {
    height: 37,
    width: 37,
  },
  flex: {
    flex: 1,
  },
};

export default function HomeScreenBottomCameraControls({
  style,
  isVisible,
  onRequestBeginCapture,
  onRequestEndCapture,
  onRequestOpenCameraRoll,
  onRequestSwitchCamera,
  video,
}: Props) {
  return (
    <SlideUpAnimatedView
      style={[styles.container, style]}
      isVisible={isVisible}
      delay={1000}
    >
      <HomeScreenCameraRollButton
        id={video}
        onPress={onRequestOpenCameraRoll}
        style={styles.cameraRollButton}
      />
      <CaptureButton
        onRequestBeginCapture={onRequestBeginCapture}
        onRequestEndCapture={onRequestEndCapture}
      />
      <SwitchCameraButton
        style={styles.switchCameraButton}
        onRequestSwitchCamera={onRequestSwitchCamera}
      />
    </SlideUpAnimatedView>
  );
}
