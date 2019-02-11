// @flow
import React from 'react';
import { Text, View, Dimensions, TouchableOpacity } from 'react-native';

import * as Fonts from '../../utils/Fonts';
import * as Color from '../../utils/Color';
import { UI_COLORS } from '../../constants';
import VideoThumbnailView from '../video-thumbnail-view/VideoThumbnailView';

import type { Style } from '../../types/react';
import type { VideoObject } from '../../types/media';

type Props = {
  style?: ?Style,
  videos: VideoObject[],
  onPressThumbnail: (video: VideoObject) => void,
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
  duration: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingBottom: 5,
    paddingRight: 7,
    ...Fonts.getFontStyle('default', { contentStyle: 'lightContent' }),
    textShadowColor: Color.hexToRgbaString(UI_COLORS.BLACK, 0.5),
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 1,
    textAlign: 'right',
  },
};

export default function VideoThumbnailGrid({
  style,
  videos,
  onPressThumbnail,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      {videos.map(video => (
        <TouchableOpacity
          key={video.id}
          onPress={() => onPressThumbnail(video)}
        >
          <View style={styles.thumbnailWrap}>
            <VideoThumbnailView style={styles.thumbnail} id={video.id} />
            <Text numberOfLines={1} style={styles.duration}>
              {formatDuration(video.duration)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function formatDuration(duration: number): string {
  const minutes = parseInt(duration / 60).toFixed(0);
  const seconds = parseInt(duration % 60)
    .toFixed(0)
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}
