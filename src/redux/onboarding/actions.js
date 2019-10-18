// @flow
import Promise from 'bluebird';
import { authorizeMediaLibrary } from '@jonbrennecke/react-native-media';
import { requestSpeechPermissions, hasSpeechPermissions } from '@jonbrennecke/react-native-speech';
import {
  requestCameraPermissions,
  hasCameraPermissions,
} from '@jonbrennecke/react-native-camera';

export const arePermissionsGranted = async (): Promise<boolean> => {
  const areCameraPermissionsGranted = await hasCameraPermissions();
  const areSpeechPermissionsGranted = await hasSpeechPermissions();
  const areMediaPermissionsGranted = await authorizeMediaLibrary(); // TODO: rename to match the other functions
  return (
    areCameraPermissionsGranted &&
    areSpeechPermissionsGranted &&
    areMediaPermissionsGranted
  );
};

export const requestAppPermissions = async (): Promise<boolean> => {
  const areCameraPermissionsGranted = await requestCameraPermissions();
  const areSpeechPermissionsGranted = await requestSpeechPermissions();
  const areMediaPermissionsGranted = await authorizeMediaLibrary();
  return (
    areCameraPermissionsGranted &&
    areSpeechPermissionsGranted &&
    areMediaPermissionsGranted
  );
};
