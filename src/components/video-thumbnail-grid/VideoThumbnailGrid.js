// @flow
import React from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';

import VideoThumbnailView from '../video-thumbnail-view/VideoThumbnailView';

import type { Style } from '../../types/react';
import type { VideoAssetIdentifier, VideoObject } from '../../types/media';

type Props = {
  style?: ?Style,
  videos: VideoObject[],
  onPressThumbnail: (id: VideoAssetIdentifier) => void,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  thumbnailWrap: {
    width: SCREEN_WIDTH / 3,
    height: SCREEN_WIDTH / 3 * (4 / 3),
    padding: 1,
  },
  thumbnail: {
    flex: 1,
    borderRadius: 3,
    overflow: 'hidden',
  },
};

export default function VideoThumbnailGrid({
  style,
  videos,
  onPressThumbnail,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      {videos.map(({ id }) => (
        <TouchableOpacity key={id} onPress={() => onPressThumbnail(id)}>
          <View style={styles.thumbnailWrap}>
            <VideoThumbnailView style={styles.thumbnail} id={id} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
