// @flow
import Promise from 'bluebird';
import { authorizeMediaLibrary } from '@jonbrennecke/react-native-media';
import { requestCameraPermissions, hasCameraPermissions } from '@jonbrennecke/react-native-camera';

import { requestSpeechPermissions, hasSpeechPermissions } from '../../utils/SpeechManager';

export const arePermissionsGranted = async (): Promise<boolean> => {
  const areCameraPermissionsGranted = await hasCameraPermissions();
  const areSpeechPermissionsGranted = await hasSpeechPermissions();
  const areMediaPermissionsGranted = await authorizeMediaLibrary(); // TODO
  return areCameraPermissionsGranted && areSpeechPermissionsGranted && areMediaPermissionsGranted;
};

export const requestAppPermissions = async (): Promise<boolean> => {
  const areCameraPermissionsGranted = await requestCameraPermissions();
  const areSpeechPermissionsGranted = await requestSpeechPermissions();
  const areMediaPermissionsGranted = await authorizeMediaLibrary();
  return areCameraPermissionsGranted && areSpeechPermissionsGranted && areMediaPermissionsGranted;
};
