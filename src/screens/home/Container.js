// @flow
import React from 'react';
import { connect } from 'react-redux';
import { selectAssets } from '@jonbrennecke/react-native-media';

import { arePermissionsGranted } from '../../redux/onboarding/selectors';
import {
  beginCameraCapture,
  endCameraCapture,
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
  isCameraRecording,
  getCurrentVideo,
} from '../../redux/media/selectors';
import { updateCaptionStyle } from '../../redux/video/actionCreators';
import { getCaptionStyle } from '../../redux/video/selectors';
import {
  getSpeechTranscriptions,
  getLocale,
} from '../../redux/speech/selectors';

import type { MediaObject } from '@jonbrennecke/react-native-media';

import type { ComponentType } from 'react';
import type { Dispatch, AppState } from '../../types/redux';
import type { VideoAssetIdentifier } from '../../types/media';
import type { LocaleObject, SpeechTranscription } from '../../types/speech';
import type { CaptionStyleObject } from '../../types/video';

type OwnProps = {|
  componentId: string,
|};

type StateProps = {|
  thumbnailVideoID: ?string,
  arePermissionsGranted: boolean,
  isCameraRecording: boolean,
  currentVideo: ?VideoAssetIdentifier,
  captionStyle: CaptionStyleObject,
  speechTranscriptions: Map<VideoAssetIdentifier, SpeechTranscription>,
  locale: ?LocaleObject,
|};

type DispatchProps = {|
  receiveLocale: (locale: LocaleObject) => Promise<void>,
  loadCurrentLocale: () => Promise<void>,
  setLocale: (locale: LocaleObject) => Promise<void>,
  loadDeviceInfo: () => Promise<void>,
  beginCameraCapture: () => Promise<void>,
  endCameraCapture: () => Promise<void>,
  beginSpeechTranscriptionWithAudioSession: () => Promise<void>,
  endSpeechTranscriptionWithAudioSession: () => Promise<void>,
  receiveSpeechTranscriptionSuccess: (
    VideoAssetIdentifier,
    SpeechTranscription
  ) => void,
  receiveSpeechTranscriptionFailure: VideoAssetIdentifier => void,
  receiveFinishedVideo: MediaObject => void,
  updateCaptionStyle: typeof updateCaptionStyle,
|};

export type Props = {| ...OwnProps, ...StateProps, ...DispatchProps |};

function mapStateToProps(state: AppState): StateProps {
  const assets = selectAssets(state.newMedia);
  const thumbnailVideoID = assets.first()?.assetID;
  return {
    thumbnailVideoID,
    arePermissionsGranted: arePermissionsGranted(state),
    isCameraRecording: isCameraRecording(state),
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
    beginCameraCapture: () => dispatch(beginCameraCapture()),
    endCameraCapture: () => dispatch(endCameraCapture()),
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
    receiveFinishedVideo: () =>
      dispatch(receiveFinishedVideo()),
    updateCaptionStyle: partialCaptionStyle =>
      dispatch(updateCaptionStyle(partialCaptionStyle)),
  };
}

export default function Container<C: ComponentType<Props>>(
  Component: C
): ComponentType<Props> {
  const fn = (props: Props) => <Component {...props} />;
  return connect(mapStateToProps, mapDispatchToProps)(fn);
}
