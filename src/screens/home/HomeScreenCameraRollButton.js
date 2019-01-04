// @flow
import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import VideoThumbnailView from '../../components/video-thumbnail-view/VideoThumbnailView';
import { UI_COLORS } from '../../constants';

import type { Style } from '../../types/react';
import type { VideoAssetIdentifier } from '../../types/media';

type Props = {
  style?: ?Style,
  onPress: () => void,
  videoAssetIdentifier: ?VideoAssetIdentifier,
};

const styles = {
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
  flex: {
    flex: 1,
  },
};

export default function HomeScreenCameraRollButton({
  style,
  onPress,
  videoAssetIdentifier,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.cameraRollButton, style]}
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
  );
}
