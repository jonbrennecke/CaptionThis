// @flow
import { reducer as newMediaReducer } from '@jonbrennecke/react-native-media';
import { reducer as cameraReducer } from '@jonbrennecke/react-native-camera';
import onboardingReducer from './onboarding/reducer';
import mediaReducer from './media/reducer';
import deviceReducer from './device/reducer';
import videoReducer from './video/reducer';
import speechReducer from './speech/reducer';

export default {
  onboarding: onboardingReducer,
  media: mediaReducer,
  newMedia: newMediaReducer,
  device: deviceReducer,
  video: videoReducer,
  speech: speechReducer,
  camera: cameraReducer,
};
