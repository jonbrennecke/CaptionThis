// @flow
import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import CaptureButton from '../../components/capture-button/CaptureButton';
import VideoThumbnailView from '../../components/video-thumbnail-view/VideoThumbnailView';
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
    borderRadius: 3,
    borderWidth: 2,
    borderColor: UI_COLORS.OFF_WHITE,
    backgroundColor: UI_COLORS.DARK_GREY,
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
      <TouchableOpacity
        onPress={onRequestOpenCameraRoll}
        style={styles.cameraRollButton}
      >
        <View style={styles.buttonInside}>
          {videoAssetIdentifier && (
            <VideoThumbnailView
              style={styles.flex}
              videoAssetIdentifier={videoAssetIdentifier}
            />
          )}
        </View>
      </TouchableOpacity>
      <CaptureButton
        onRequestBeginCapture={onRequestBeginCapture}
        onRequestEndCapture={onRequestEndCapture}
      />
      <TouchableOpacity
        onPress={onRequestSwitchCamera}
        style={styles.switchCameraButton}
      >
        <View />
      </TouchableOpacity>
    </View>
  );
}
