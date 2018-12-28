// @flow
import React from 'react';
import { View, Dimensions } from 'react-native';

import VideoThumbnailView from '../video-thumbnail-view/VideoThumbnailView';

import type { Style } from '../../types/react';
import type { VideoAssetIdentifier } from '../../types/media';

type Props = {
  style?: ?Style,
  videoAssetIdentifiers: VideoAssetIdentifier[],
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  thumbnail: {
    width: SCREEN_WIDTH / 3,
    height: SCREEN_WIDTH / 3 * (4 / 3),
    padding: 5,
  },
};

export default function VideoThumbnailGrid({
  style,
  videoAssetIdentifiers,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      {videoAssetIdentifiers
        .map(id => (
          <VideoThumbnailView
            key={id}
            style={styles.thumbnail}
            videoAssetIdentifier={id}
          />
        ))}
    </View>
  );
}
