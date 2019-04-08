// @flow
import React from 'react';
import { connect } from 'react-redux';

import { arePermissionsGranted } from '../../redux/onboarding/selectors';
import {
  receiveVideos,
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
  getVideos,
  isCameraRecording,
  getCurrentVideo,
} from '../../redux/media/selectors';
import { updateCaptionStyle } from '../../redux/video/actionCreators';
import { getFontFamily } from '../../redux/video/selectors';
import {
  getSpeechTranscriptions,
  getLocale,
} from '../../redux/speech/selectors';

import type { ComponentType } from 'react';
import type { Dispatch, AppState } from '../../types/redux';
import type {
  VideoAssetIdentifier,
  VideoObject,
} from '../../types/media';
import type { LocaleObject, SpeechTranscription } from '../../types/speech';

type OwnProps = {|
  componentId: string,
|};

type StateProps = {|
  videos: VideoObject[],
  arePermissionsGranted: boolean,
  isCameraRecording: boolean,
  currentVideo: ?VideoAssetIdentifier,
  fontFamily: string,
  speechTranscriptions: Map<VideoAssetIdentifier, SpeechTranscription>,
  locale: ?LocaleObject,
|};

type DispatchProps = {|
  receiveLocale: (locale: LocaleObject) => Promise<void>,
  loadCurrentLocale: () => Promise<void>,
  setLocale: (locale: LocaleObject) => Promise<void>,
  loadDeviceInfo: () => Promise<void>,
  receiveVideos: (videos: VideoObject[]) => Promise<void>,
  beginCameraCapture: () => Promise<void>,
  endCameraCapture: () => Promise<void>,
  beginSpeechTranscriptionWithAudioSession: () => Promise<void>,
  endSpeechTranscriptionWithAudioSession: () => Promise<void>,
  receiveSpeechTranscriptionSuccess: (
    VideoAssetIdentifier,
    SpeechTranscription
  ) => void,
  receiveSpeechTranscriptionFailure: VideoAssetIdentifier => void,
  receiveFinishedVideo: VideoObject => void,
  updateCaptionStyle: typeof updateCaptionStyle,
|};

export type Props = {| ...OwnProps, ...StateProps, ...DispatchProps |};

function mapStateToProps(state: AppState): StateProps {
  return {
    videos: getVideos(state),
    arePermissionsGranted: arePermissionsGranted(state),
    isCameraRecording: isCameraRecording(state),
    currentVideo: getCurrentVideo(state),
    fontFamily: getFontFamily(state),
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
    receiveVideos: (videos: VideoObject[]) => dispatch(receiveVideos(videos)),
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
    receiveFinishedVideo: (video: VideoObject) =>
      dispatch(receiveFinishedVideo(video)),
    updateCaptionStyle: partialCaptionStyle => dispatch(updateCaptionStyle(partialCaptionStyle)),
  };
}

export default function Container<C: ComponentType<Props>>(
  Component: C
): ComponentType<Props> {
  const fn = (props: Props) => <Component {...props} />;
  return connect(mapStateToProps, mapDispatchToProps)(fn);
}
