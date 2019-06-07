/* @flow */
import typeof { LOADING_STATE, TRANSCRIPTION_STATE } from '../constants';
import type { VideoAssetIdentifier, VideoObject } from './media';
import type { SpeechTranscription, LocaleObject } from './speech';
import type { ReactAppStateEnum } from './react';
import type { DeviceInfoObject } from '../utils/Device';
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
  speech: SpeechState,
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
  videos: VideoObject[],
  mediaLoadingState: $Keys<LOADING_STATE>,
  videoExportState: $Keys<LOADING_STATE>,
  cameraRecordingState: {
    isRecording: boolean,
    videoAssetIdentifier: ?VideoAssetIdentifier,
  },
|};

export type DeviceState = {|
  appState: ReactAppStateEnum,
  deviceInfo: ?DeviceInfoObject,
|};

export type VideoState = {|
  captionStyle: CaptionStyleObject,
|};

export type SpeechState = {|
  locale: ?LocaleObject,
  speechTranscriptions: Map<VideoAssetIdentifier, SpeechTranscription>,
  speechTranscriptionState: $Keys<TRANSCRIPTION_STATE>,
|};

export type Payload =
  | ReceiveLoginPayload
  | ReceiveAuthPayload
  | ReceivePermissionsPayload
  | ReceiveVideoAssetsPayload
  | ReceiveVideoAssetPayload
  | ReceiveSpeechTranscriptionPayload
  | ReceiveAppStateChangePayload
  | ReceiveDeviceInfoPayload
  | ReceiveLocalePayload
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

export type ReceiveSpeechTranscriptionPayload = {|
  videoAssetIdentifier: VideoAssetIdentifier,
  transcription: SpeechTranscription,
|};

export type ReceiveAppStateChangePayload = {|
  appState: ReactAppStateEnum,
|};

export type ReceiveDeviceInfoPayload = {|
  deviceInfo: DeviceInfoObject,
|};

export type ReceiveLocalePayload = {|
  locale: LocaleObject,
|};

export type ReceiveCaptionStylePayload = {|
  captionStyle: CaptionStyleObject,
|};
