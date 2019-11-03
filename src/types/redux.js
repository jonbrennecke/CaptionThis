/* @flow */
import type { IMediaState } from '@jonbrennecke/react-native-media';
import type { ISpeechState } from '@jonbrennecke/react-native-speech';

import typeof { LOADING_STATE } from '../constants';
import type { VideoAssetIdentifier, VideoObject } from './media';
import type { ReactAppStateEnum } from './react';
import type { CaptionStyleObject } from './video';

export type Action<T> = {
  +type: string,
  payload?: T,
};

export type ThunkAction<T> = (dispatch: Dispatch<T>, getState: GetState) => any;

export type PromiseAction<T> = Promise<Action<T>>;

export type Dispatch<T> = (
  action: Action<T> | ThunkAction<T> | PromiseAction<T> | Array<Action<T>>
) => any;

export type AppState = {
  auth: AuthState,
  onboarding: OnboardingState,
  media: MediaState,
  device: DeviceState,
  video: VideoState,
  speech: ISpeechState,
  newMedia: IMediaState,
};

export type GetState = () => AppState;

export type AuthState = {|
  token: ?string,
  authLoadingState: $Keys<LOADING_STATE>,
|};

export type OnboardingState = {|
  arePermissionsGranted: boolean,
  permissionsLoadingState: $Keys<LOADING_STATE>,
|};

export type MediaState = {|
  videoExportState: $Keys<LOADING_STATE>,
  recordedVideoID: ?VideoAssetIdentifier,
|};

export type DeviceState = {|
  appState: ReactAppStateEnum,
|};

export type VideoState = {|
  captionStyle: CaptionStyleObject,
|};

export type Payload =
  | ReceiveLoginPayload
  | ReceiveAuthPayload
  | ReceivePermissionsPayload
  | ReceiveVideoAssetsPayload
  | ReceiveVideoAssetPayload
  | ReceiveAppStateChangePayload
  | ReceiveCaptionStylePayload;

export type ReceiveLoginPayload = {|
  token: string,
|};

export type ReceiveAuthPayload = ReceiveLoginPayload;

export type ReceivePermissionsPayload = {|
  arePermissionsGranted: boolean,
|};

export type ReceiveVideoAssetsPayload = {|
  videos: VideoObject[],
|};

export type ReceiveVideoAssetPayload = {|
  video: VideoObject,
|};

export type ReceiveVideoAssetIdPayload = {|
  videoAssetIdentifier: VideoAssetIdentifier,
|};

export type ReceiveAppStateChangePayload = {|
  appState: ReactAppStateEnum,
|};

export type ReceiveCaptionStylePayload = {|
  captionStyle: CaptionStyleObject,
|};
