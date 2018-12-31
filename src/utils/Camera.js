// @flow
import Promise from 'bluebird';
import { NativeModules } from 'react-native';

import type { VideoAssetIdentifier } from '../types/media';

const { Camera: _NativeCameraModule } = NativeModules;
const NativeCameraModule = Promise.promisifyAll(_NativeCameraModule);

export function startPreview() {
  NativeCameraModule.startCameraPreview();
}

export const startCapture = async (): Promise<VideoAssetIdentifier> => {
  return await NativeCameraModule.startCameraCaptureAsync();
};

export function stopCapture() {
  NativeCameraModule.stopCameraCapture();
}
