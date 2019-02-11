/* @flow */
import typeof { LOADING_STATE, TRANSCRIPTION_STATE } from '../constants';
import type { VideoAssetIdentifier, ColorRGBA, VideoObject } from './media';
import type { SpeechTranscription } from './speech';
import type { LineStyle } from './video';
import type { ReactAppStateEnum } from './react';
import type { DeviceInfoObject } from '../utils/Device';

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
  fontFamily: string,
  fontSize: number,
  backgroundColor: ColorRGBA,
  textColor: ColorRGBA,
  lineStyle: LineStyle,
|};

export type SpeechState = {|
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
  | ReceiveFontFamilyPayload
  | ReceiveBackgroundColorPayload
  | ReceiveTextColorPayload
  | ReceiveFontSizePayload
  | ReceiveAppStateChangePayload
  | ReceiveDeviceInfoPayload;

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

export type ReceiveFontFamilyPayload = {|
  fontFamily: string,
|};

export type ReceiveBackgroundColorPayload = {|
  backgroundColor: ColorRGBA,
|};

export type ReceiveTextColorPayload = {|
  textColor: ColorRGBA,
|};

export type ReceiveFontSizePayload = {|
  fontSize: number,
|};

export type ReceiveAppStateChangePayload = {|
  appState: ReactAppStateEnum,
|};

export type ReceiveDeviceInfoPayload = {|
  deviceInfo: DeviceInfoObject,
|};
