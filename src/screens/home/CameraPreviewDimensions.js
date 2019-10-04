// @flow
import React from 'react';
import { View, Dimensions } from 'react-native';

import type { CameraFormat } from '@jonbrennecke/react-native-camera';

import type { SFC, Children, Style } from '../../types';

export type CameraPreviewDimensionsProps = {
  style?: ?Style,
  children?: ?Children,
  cameraFormat: ?CameraFormat,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = {
  aspectRatio: (cameraFormat: ?CameraFormat) => {
    if (!cameraFormat) {
      return {};
    }
    const aspectRatio =
      cameraFormat.dimensions.width / cameraFormat.dimensions.height;
    return {
      width: SCREEN_WIDTH,
      height: SCREEN_WIDTH * aspectRatio,
    };
  },
};

export const CameraPreviewDimensions: SFC<CameraPreviewDimensionsProps> = ({
  style,
  children,
  cameraFormat,
}: CameraPreviewDimensionsProps) => (
  <View style={[styles.aspectRatio(cameraFormat), style]}>{children}</View>
);
