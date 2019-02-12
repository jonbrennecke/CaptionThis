// @flow
import Promise from 'bluebird';
import { NativeModules, NativeEventEmitter } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import type { VideoObject } from '../types/media';
import type { Return } from '../types/util';

const { Camera: _NativeCameraModule } = NativeModules;
const NativeCameraModule = Promise.promisifyAll(_NativeCameraModule, {
  multiArgs: true,
});
const NativeCameraManagerEventEmitter = new NativeEventEmitter(
  _NativeCameraModule
);

// eslint-disable-next-line flowtype/generic-spacing
export type EmitterSubscription = Return<
  typeof NativeCameraManagerEventEmitter.addListener
>;

const EVENTS = {
  CAMERA_MANAGER_DID_FINISH_FILE_OUTPUT: 'cameraManagerDidFinishFileOutput',
  CAMERA_MANAGER_DID_FINISH_FILE_OUTPUT_WITH_ERROR:
    'cameraManagerDidFinishFileOutputWithError',
};

export function addDidFinishFileOutputListener(
  listener: VideoObject => void
): EmitterSubscription {
  return NativeCameraManagerEventEmitter.addListener(
    EVENTS.CAMERA_MANAGER_DID_FINISH_FILE_OUTPUT,
    (video: VideoObject) => {
      listener(video);
    }
  );
}

export function addDidFinishFileOutputWithErrorListener(
  listener: (error: Error) => void
): EmitterSubscription {
  return NativeCameraManagerEventEmitter.addListener(
    EVENTS.CAMERA_MANAGER_DID_FINISH_FILE_OUTPUT_WITH_ERROR,
    listener
  );
}

export function startPreview() {
  if (DeviceInfo.isEmulator()) {
    return;
  }
  NativeCameraModule.startCameraPreview();
}

export function stopPreview() {
  NativeCameraModule.stopCameraPreview();
}

export const startCapture = async (): Promise<boolean> => {
  const [success] = await NativeCameraModule.startCameraCaptureAsync();
  return success;
};

export function stopCapture() {
  NativeCameraModule.stopCameraCapture();
}

export function switchToOppositeCamera() {
  NativeCameraModule.switchToOppositeCamera();
}
