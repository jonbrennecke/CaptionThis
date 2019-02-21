// @flow
import React from 'react';
import { View } from 'react-native';


import HomeScreenBottomCameraControls from './HomeScreenBottomCameraControls';
import HomeScreenTopCameraControls from './HomeScreenTopCameraControls';

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
    
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'blue',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
};

export default function HomeScreenCameraControls({
  style,
  video,
  isVisible,
  onRequestBeginCapture,
  onRequestEndCapture,
  onRequestOpenCameraRoll,
  onRequestSwitchCamera,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <HomeScreenTopCameraControls style={styles.topControls}/>
      <HomeScreenBottomCameraControls
        style={styles.bottomControls}
        isVisible={isVisible}
        onRequestBeginCapture={onRequestBeginCapture}
        onRequestEndCapture={onRequestEndCapture}
        onRequestOpenCameraRoll={onRequestOpenCameraRoll}
        onRequestSwitchCamera={onRequestSwitchCamera}
        video={video}
      />
    </View>
  );
}
