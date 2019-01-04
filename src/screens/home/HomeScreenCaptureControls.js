// @flow
import React from 'react';
import { View } from 'react-native';

import CaptureButton from '../../components/capture-button/CaptureButton';
import SwitchCameraButton from '../../components/switch-camera-button/SwitchCameraButton';
import HomeScreenCameraRollButton from './HomeScreenCameraRollButton';
import { UI_COLORS } from '../../constants';

import type { Style } from '../../types/react';
import type { VideoAssetIdentifier } from '../../types/media';

type Props = {
  style?: ?Style,
  onRequestBeginCapture: () => void,
  onRequestEndCapture: () => void,
  onRequestOpenCameraRoll: () => void,
  onRequestSwitchCamera: () => void,
  videoAssetIdentifier: ?VideoAssetIdentifier,
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
    borderRadius: 5,
    borderWidth: 2.5,
    borderColor: UI_COLORS.OFF_WHITE,
    shadowColor: UI_COLORS.BLACK,
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowRadius: 5,
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

export default function HomeScreenCaptureControls({
  style,
  onRequestBeginCapture,
  onRequestEndCapture,
  onRequestOpenCameraRoll,
  onRequestSwitchCamera,
  videoAssetIdentifier,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <HomeScreenCameraRollButton
        videoAssetIdentifier={videoAssetIdentifier}
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
    </View>
  );
}
