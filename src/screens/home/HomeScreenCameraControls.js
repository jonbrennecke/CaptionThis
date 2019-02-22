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
  countryCode: ?string,
  onRequestBeginCapture: () => void,
  onRequestEndCapture: () => void,
  onRequestOpenCameraRoll: () => void,
  onRequestSwitchCamera: () => void,
  onRequestOpenLocaleMenu: () => void,
  video: ?VideoAssetIdentifier,
};

const styles = {
  container: {},
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
};

export default function HomeScreenCameraControls({
  style,
  video,
  isVisible,
  countryCode,
  onRequestBeginCapture,
  onRequestEndCapture,
  onRequestOpenCameraRoll,
  onRequestSwitchCamera,
  onRequestOpenLocaleMenu,
}: Props) {
  return (
    <View style={[styles.container, style]} pointerEvents="box-none">
      <HomeScreenTopCameraControls
        style={styles.topControls}
        countryCode={countryCode}
        onRequestOpenLocaleMenu={onRequestOpenLocaleMenu}
      />
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
