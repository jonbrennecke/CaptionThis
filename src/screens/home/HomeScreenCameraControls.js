// @flow
import React from 'react';
import { View } from 'react-native';

import HomeScreenBottomCameraControls from './HomeScreenBottomCameraControls';
import HomeScreenTopCameraControls from './HomeScreenTopCameraControls';

import type { Style } from '../../types/react';
import type { VideoAssetIdentifier, ColorRGBA } from '../../types/media';
import type {
  CaptionTextAlignment,
  CaptionLineStyle,
  CaptionWordStyle,
  CaptionBackgroundStyle,
} from '../../types/video';

type Props = {
  style?: ?Style,
  isVisible: boolean,
  countryCode: ?string,
  video: ?VideoAssetIdentifier,
  onRequestBeginCapture: () => void,
  onRequestEndCapture: () => void,
  onRequestOpenCameraRoll: () => void,
  onRequestSwitchCamera: () => void,
  onRequestOpenLocaleMenu: () => void,
  onRequestSetFontFamily: string => void,
  onRequestSetBackgroundColor: ColorRGBA => void,
  onRequestSetTextColor: ColorRGBA => void,
  onRequestSetTextAlignment: CaptionTextAlignment => void,
  onRequestSetLineStyle: CaptionLineStyle => void,
  onRequestSetWordStyle: CaptionWordStyle => void,
  onRequestSetBackgroundStyle: CaptionBackgroundStyle => void,
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
  onRequestSetFontFamily,
  onRequestSetBackgroundColor,
  onRequestSetTextColor,
  onRequestSetTextAlignment,
  onRequestSetLineStyle,
  onRequestSetWordStyle,
  onRequestSetBackgroundStyle,
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
        onRequestBeginCapture={onRequestBeginCapture}
        onRequestEndCapture={onRequestEndCapture}
        onRequestOpenCameraRoll={onRequestOpenCameraRoll}
        onRequestSwitchCamera={onRequestSwitchCamera}
        onRequestSetFontFamily={onRequestSetFontFamily}
        onRequestSetBackgroundColor={onRequestSetBackgroundColor}
        onRequestSetTextColor={onRequestSetTextColor}
        onRequestSetTextAlignment={onRequestSetTextAlignment}
        onRequestSetLineStyle={onRequestSetLineStyle}
        onRequestSetWordStyle={onRequestSetWordStyle}
        onRequestSetBackgroundStyle={onRequestSetBackgroundStyle}
      />
    </View>
  );
}
