// @flow
import { NativeModules } from 'react-native';

const { Camera: NativeCameraModule } = NativeModules;

export function startPreview() {
  NativeCameraModule.startCameraPreview();
}

export function startCapture() {
  NativeCameraModule.startCameraCapture();
}

export function stopCapture() {
  NativeCameraModule.stopCameraCapture();
}
