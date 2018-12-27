// @flow
import React from 'react';
import { requireNativeComponent } from 'react-native';

import type { Style } from '../../types/react';

const NativeCameraPreviewView = requireNativeComponent('CameraPreview');

type Props = {
  style: ?Style,
};

export default function CameraPreviewView({ style }: Props) {
  return <NativeCameraPreviewView style={style} />;
}
