// @flow
import React from 'react';
import { View } from 'react-native';

import VideoThumbnailView from '../video-thumbnail-view/VideoThumbnailView';

import type { Style } from '../../types/react';
import type { VideoAssetIdentifier } from '../../types/media';

type Props = {
  style?: ?Style,
  videoAssetIdentifiers: VideoAssetIdentifier[],
};

const styles = {
  container: {
    flex: 1,
  },
};

export default function VideoThumbnailGrid({
  style,
  videoAssetIdentifiers,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      {videoAssetIdentifiers.map(id => (
        <VideoThumbnailView key={id} videoAssetIdentifier={id} />
      ))}
    </View>
  );
}
