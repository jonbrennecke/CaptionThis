// @flow
import authReducer from './auth/reducer';
import onboardingReducer from './onboarding/reducer';
import mediaReducer from './media/reducer';
import deviceReducer from './device/reducer';
import videoReducer from './video/reducer';
import speechReducer from './speech/reducer';

export default {
  auth: authReducer,
  onboarding: onboardingReducer,
  media: mediaReducer,
  device: deviceReducer,
  video: videoReducer,
  speech: speechReducer,
};
