// @flow
import React from 'react';
import { connect } from 'react-redux';
import { selectAssets, createMediaStateHOC } from '@jonbrennecke/react-native-media';

import { arePermissionsGranted } from '../../redux/onboarding/selectors';
import {
  receiveFinishedVideo,
} from '../../redux/media/actionCreators';
import {
  beginSpeechTranscriptionWithAudioSession,
  endSpeechTranscriptionWithAudioSession,
  receiveSpeechTranscriptionFailure,
  receiveSpeechTranscriptionSuccess,
  setLocale,
  receiveLocale,
  loadCurrentLocale,
} from '../../redux/speech/actionCreators';
import { loadDeviceInfo } from '../../redux/device/actionCreators';
import {
  getCurrentVideo,
} from '../../redux/media/selectors';
import { updateCaptionStyle } from '../../redux/video/actionCreators';
import { getCaptionStyle } from '../../redux/video/selectors';
import {
  getSpeechTranscriptions,
  getLocale,
} from '../../redux/speech/selectors';
import { wrapWithCameraState } from './cameraState';

import type { MediaObject, MediaStateHOCProps } from '@jonbrennecke/react-native-media';

import type { CameraStateProps } from './cameraState';
import type { ComponentType } from 'react';
import type { Dispatch, AppState } from '../../types/redux';
import type { VideoAssetIdentifier } from '../../types/media';
import type { LocaleObject, SpeechTranscription } from '../../types/speech';
import type { CaptionStyleObject } from '../../types/video';

type OwnProps = {
  componentId: string,
};

type StateProps = {
  thumbnailVideoID: ?string,
  arePermissionsGranted: boolean,
  currentVideo: ?VideoAssetIdentifier,
  captionStyle: CaptionStyleObject,
  speechTranscriptions: Map<VideoAssetIdentifier, SpeechTranscription>,
  locale: ?LocaleObject,
};

type DispatchProps = {
  receiveLocale: (locale: LocaleObject) => Promise<void>,
  loadCurrentLocale: () => Promise<void>,
  setLocale: (locale: LocaleObject) => Promise<void>,
  loadDeviceInfo: () => Promise<void>,
  beginSpeechTranscriptionWithAudioSession: () => Promise<void>,
  endSpeechTranscriptionWithAudioSession: () => Promise<void>,
  receiveSpeechTranscriptionSuccess: (
    VideoAssetIdentifier,
    SpeechTranscription
  ) => void,
  receiveSpeechTranscriptionFailure: VideoAssetIdentifier => void,
  receiveFinishedVideo: MediaObject => void,
  updateCaptionStyle: typeof updateCaptionStyle,
};

export type HomeScreenStateReduxProps = OwnProps & StateProps & DispatchProps;

export type HomeScreenStateProps = HomeScreenStateReduxProps & CameraStateProps & MediaStateHOCProps;

function mapStateToProps(state: AppState): StateProps {
  const assets = selectAssets(state.newMedia);
  const thumbnailVideoID = assets.first()?.assetID;
  return {
    thumbnailVideoID,
    arePermissionsGranted: arePermissionsGranted(state),
    currentVideo: getCurrentVideo(state),
    captionStyle: getCaptionStyle(state),
    speechTranscriptions: getSpeechTranscriptions(state),
    locale: getLocale(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    loadCurrentLocale: () => dispatch(loadCurrentLocale()),
    receiveLocale: (locale: LocaleObject) => dispatch(receiveLocale(locale)),
    setLocale: (locale: LocaleObject) => dispatch(setLocale(locale)),
    loadDeviceInfo: () => dispatch(loadDeviceInfo()),
    beginSpeechTranscriptionWithAudioSession: () =>
      dispatch(beginSpeechTranscriptionWithAudioSession()),
    endSpeechTranscriptionWithAudioSession: () =>
      dispatch(endSpeechTranscriptionWithAudioSession()),
    receiveSpeechTranscriptionSuccess: (
      id: VideoAssetIdentifier,
      transcription: SpeechTranscription
    ) => dispatch(receiveSpeechTranscriptionSuccess(id, transcription)),
    receiveSpeechTranscriptionFailure: (id: VideoAssetIdentifier) =>
      dispatch(receiveSpeechTranscriptionFailure(id)),
    receiveFinishedVideo: () => dispatch(receiveFinishedVideo()),
    updateCaptionStyle: partialCaptionStyle =>
      dispatch(updateCaptionStyle(partialCaptionStyle)),
  };
}

export function wrapWithHomeScreenState<
  PassThroughProps: Object,
  C: ComponentType<HomeScreenStateProps & PassThroughProps>
>(Component: C): ComponentType<PassThroughProps> {
  const wrapWithMediaState = createMediaStateHOC(state => state.newMedia);
  const ComponentWithCameraState = wrapWithCameraState(Component);
  const ComponentWithMediaState = wrapWithMediaState(ComponentWithCameraState);
  const fn = (props: HomeScreenStateReduxProps & PassThroughProps) => (
    <ComponentWithMediaState {...props} />
  );
  return connect(mapStateToProps, mapDispatchToProps)(fn);
}
