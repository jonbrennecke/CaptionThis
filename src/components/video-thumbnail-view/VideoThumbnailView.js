// @flow
import React from 'react';
import { View } from 'react-native';

import type { Style } from '../../types/react';
import type { VideoAssetIdentifier } from '../../types/media';

type Props = {
  style?: ?Style,
  videoAssetIdentifier: VideoAssetIdentifier,
};

const styles = {
  container: {
    flex: 1,
  },
};

export default function VideoThumbnailView({
  style,
  videoAssetIdentifier,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <View />
    </View>
  );
}
