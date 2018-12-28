/* @flow */
import typeof { LOADING_STATE } from '../constants';
import type { VideoAssetIdentifier } from './media';

export type Action<T> = {
  type: string,
  payload?: T,
};

export type Dispatch = any => any;

export type AppState = {
  auth: AuthState,
  onboarding: OnboardingState,
  media: MediaState,
};

export type GetState = () => AppState;

export type AuthState = {
  token: ?string,
  authLoadingState: $Keys<LOADING_STATE>,
};

export type ReceiveLoginPayload = {
  token: string,
};

export type ReceiveAuthPayload = ReceiveLoginPayload;

export type OnboardingState = {
  arePermissionsGranted: ?boolean,
  permissionsLoadingState: $Keys<LOADING_STATE>,
};

export type ReceivePermissionsPayload = {
  arePermissionsGranted: boolean,
};

export type MediaState = {
  mediaLoadingState: $Keys<LOADING_STATE>,
};

export type ReceiveVideoAssetsPayload = {
  videoAssetIdentifiers: VideoAssetIdentifier[],
};
