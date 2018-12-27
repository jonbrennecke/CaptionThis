// @flow
import React from 'react';
import { requireNativeComponent, View, Text } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';

import type { Style } from '../../types/react';

const NativeCameraPreviewView = requireNativeComponent('CameraPreview');

type Props = {
  style: ?Style,
};

const styles = {
  previewView: {
    backgroundColor: UI_COLORS.DARK_GREY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: Fonts.getFontStyle('default', { contentStyle: 'lightContent' }),
};

export default function CameraPreviewView({ style }: Props) {
  if (DeviceInfo.isEmulator()) {
    return (
      <View style={[styles.previewView, style]}>
        <Text style={styles.text}>Camera preview placeholder</Text>
      </View>
    );
  }
  return <NativeCameraPreviewView style={[styles.previewView, style]} />;
}
