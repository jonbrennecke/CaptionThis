// @flow
import React from 'react';
import { View, requireNativeComponent } from 'react-native';

import type { Style } from '../../types/react';
import type { VideoAssetIdentifier } from '../../types/media';

type Props = {
  style?: ?Style,
  videoAssetIdentifier: VideoAssetIdentifier,
};

const NativeVideoSeekbarPreviewView = requireNativeComponent('VideoSeekbarPreviewView');

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    overflow: 'hidden',
  },
  nativeView: {
    flex: 1,
  },
};

export default function VideoSeekbarPreviewView({
  style,
  videoAssetIdentifier,
}: Props) {
  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <NativeVideoSeekbarPreviewView
        style={styles.nativeView}
        localIdentifier={videoAssetIdentifier}
      />
    </View>
  );
}
