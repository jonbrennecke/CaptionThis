// @flow
import authReducer from './auth/reducer';
import onboardingReducer from './onboarding/reducer';
import mediaReducer from './media/reducer';
import deviceReducer from './device/reducer';

export default {
  auth: authReducer,
  onboarding: onboardingReducer,
  media: mediaReducer,
  device: deviceReducer,
};
