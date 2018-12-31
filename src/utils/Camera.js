// @flow
import Promise from 'bluebird';
import { NativeModules } from 'react-native';

import type { VideoAssetIdentifier } from '../types/media';

const { Camera: _NativeCameraModule } = NativeModules;
const NativeCameraModule = Promise.promisifyAll(_NativeCameraModule, { multiArgs: true });

export function startPreview() {
  NativeCameraModule.startCameraPreview();
}

export const startCapture = async (): Promise<VideoAssetIdentifier> => {
  const [success, videoAssetIdentifier] = await NativeCameraModule.startCameraCaptureAsync();
  return {
    success, videoAssetIdentifier
  };
};

export function stopCapture() {
  NativeCameraModule.stopCameraCapture();
}
