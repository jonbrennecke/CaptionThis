// @flow
import authReducer from './auth/reducer';
import onboardingReducer from './onboarding/reducer';
import mediaReducer from './media/reducer';

export default {
  auth: authReducer,
  onboarding: onboardingReducer,
  media: mediaReducer,
};
