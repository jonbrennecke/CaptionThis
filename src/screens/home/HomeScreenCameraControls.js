// @flow
import React from 'react';
import { View } from 'react-native';

import HomeScreenBottomCameraControls from './HomeScreenBottomCameraControls';
import HomeScreenTopCameraControls from './HomeScreenTopCameraControls';

import type { Style } from '../../types/react';
import type { VideoAssetIdentifier } from '../../types/media';
import type {
  CaptionStyleObject,
  CaptionPresetStyleObject,
  CaptionTextSegment,
} from '../../types/video';

type Props = {
  style?: ?Style,
  isVisible: boolean,
  countryCode: ?string,
  video: ?VideoAssetIdentifier,
  textSegments: CaptionTextSegment[],
  captionStyle: CaptionStyleObject,
  onRequestBeginCapture: () => void,
  onRequestEndCapture: () => void,
  onRequestOpenCameraRoll: () => void,
  onRequestSwitchCamera: () => void,
  onRequestOpenLocaleMenu: () => void,
  onRequestSetCaptionStyle: CaptionPresetStyleObject => void,
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
  textSegments,
  captionStyle,
  onRequestBeginCapture,
  onRequestEndCapture,
  onRequestOpenCameraRoll,
  onRequestSwitchCamera,
  onRequestOpenLocaleMenu,
  onRequestSetCaptionStyle,
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
        video={video}
        textSegments={textSegments}
        captionStyle={captionStyle}
        onRequestBeginCapture={onRequestBeginCapture}
        onRequestEndCapture={onRequestEndCapture}
        onRequestOpenCameraRoll={onRequestOpenCameraRoll}
        onRequestSwitchCamera={onRequestSwitchCamera}
        onRequestSetCaptionStyle={onRequestSetCaptionStyle}
      />
    </View>
  );
}
