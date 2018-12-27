// @flow
import { NativeModules } from 'react-native';

const { Camera: NativeCameraModule } = NativeModules;

export function startPreview() {
  NativeCameraModule.startCameraPreview();
}
