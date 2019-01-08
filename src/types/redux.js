/* @flow */
import typeof { LOADING_STATE } from '../constants';
import type { VideoAssetIdentifier, ColorRGBA } from './media';
import type { SpeechTranscription } from './speech';

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
};

export type GetState = () => AppState;

export type AuthState = {
  token: ?string,
  authLoadingState: $Keys<LOADING_STATE>,
};

export type OnboardingState = {
  arePermissionsGranted: boolean,
  permissionsLoadingState: $Keys<LOADING_STATE>,
};

export type MediaState = {
  speechTranscriptions: Map<VideoAssetIdentifier, SpeechTranscription>,
  videoAssetIdentifiers: VideoAssetIdentifier[],
  mediaLoadingState: $Keys<LOADING_STATE>,
  videoExportState: $Keys<LOADING_STATE>,
  cameraRecordingState: {
    isRecording: boolean,
    videoAssetIdentifier: ?VideoAssetIdentifier,
  },
  fontFamily: string,
  backgroundColor: ColorRGBA,
  textColor: ColorRGBA,
};

export type Payload =
  | ReceiveLoginPayload
  | ReceiveAuthPayload
  | ReceivePermissionsPayload
  | ReceiveVideoAssetsPayload
  | ReceiveVideoAssetPayload
  | ReceiveSpeechTranscriptionPayload
  | ReceiveFontFamilyPayload
  | ReceiveBackgroundColorPayload
  | ReceiveTextColorPayload;

export type ReceiveLoginPayload = {|
  token: string,
|};

export type ReceiveAuthPayload = ReceiveLoginPayload;

export type ReceivePermissionsPayload = {|
  arePermissionsGranted: boolean,
|};

export type ReceiveVideoAssetsPayload = {|
  videoAssetIdentifiers: VideoAssetIdentifier[],
|};

export type ReceiveVideoAssetPayload = {|
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
