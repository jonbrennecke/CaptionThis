// @flow
import React from 'react';
import { connect } from 'react-redux';
import {
  willExportVideo,
  didExportVideo,
} from '../../redux/media/actionCreators';
import {
  beginSpeechTranscriptionWithVideoAsset,
  receiveSpeechTranscriptionSuccess,
  receiveSpeechTranscriptionFailure,
  setLocale,
} from '../../redux/speech/actionCreators';
import { updateCaptionStyle } from '../../redux/video/actionCreators';
import { isExportingVideo } from '../../redux/media/selectors';
import {
  didSpeechRecognitionFail,
  getLocale,
  isSpeechTranscriptionFinal,
  getSpeechTranscriptionByID,
} from '../../redux/speech/selectors';
import { getCaptionStyle } from '../../redux/video/selectors';
import { receiveAppStateChange } from '../../redux/device/actionCreators';
import {
  isAppInForeground,
  isDeviceLimitedByMemory,
} from '../../redux/device/selectors';

import type { MediaObject } from '@jonbrennecke/react-native-media';

import type { ComponentType } from 'react';
import type { VideoAssetIdentifier } from '../../types/media';
import type { Dispatch, AppState } from '../../types/redux';
import type { CaptionStyleObject } from '../../types/video';
import type { SpeechTranscription, LocaleObject } from '../../types/speech';
import type { ReactAppStateEnum } from '../../types/react';

type OwnProps = {|
  componentId: string,
  video: MediaObject,
|};

type StateProps = {|
  speechTranscription: ?SpeechTranscription,
  captionStyle: CaptionStyleObject,
  isExportingVideo: boolean,
  didSpeechRecognitionFail: boolean,
  isAppInForeground: boolean,
  isDeviceLimitedByMemory: boolean,
  locale: ?LocaleObject,
  isSpeechTranscriptionFinal: boolean,
|};

type DispatchProps = {|
  setLocale: (locale: LocaleObject) => Promise<void>,
  beginSpeechTranscriptionWithVideoAsset: (
    video: VideoAssetIdentifier
  ) => Promise<void>,
  receiveSpeechTranscriptionSuccess: (
    VideoAssetIdentifier,
    SpeechTranscription
  ) => void,
  receiveSpeechTranscriptionFailure: VideoAssetIdentifier => void,
  willExportVideo: () => Promise<void>,
  didExportVideo: () => Promise<void>,
  updateCaptionStyle: typeof updateCaptionStyle,
  receiveAppStateChange: (appState: ReactAppStateEnum) => void,
|};

export type Props = {| ...OwnProps, ...StateProps, ...DispatchProps |};

function mapStateToProps(state: AppState, ownProps: OwnProps): StateProps {
  return {
    isExportingVideo: isExportingVideo(state),
    didSpeechRecognitionFail: didSpeechRecognitionFail(state),
    isAppInForeground: isAppInForeground(state),
    isDeviceLimitedByMemory: isDeviceLimitedByMemory(state),
    locale: getLocale(state),
    isSpeechTranscriptionFinal: isSpeechTranscriptionFinal(
      state,
      ownProps.video.assetID
    ),
    speechTranscription: getSpeechTranscriptionByID(state, ownProps.video.assetID),
    captionStyle: getCaptionStyle(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    setLocale: locale => dispatch(setLocale(locale)),
    beginSpeechTranscriptionWithVideoAsset: id =>
      dispatch(beginSpeechTranscriptionWithVideoAsset(id)),
    receiveSpeechTranscriptionSuccess: (id, transcription) =>
      dispatch(receiveSpeechTranscriptionSuccess(id, transcription)),
    receiveSpeechTranscriptionFailure: id =>
      dispatch(receiveSpeechTranscriptionFailure(id)),
    willExportVideo: () => dispatch(willExportVideo()),
    didExportVideo: () => dispatch(didExportVideo()),
    updateCaptionStyle: partialCaptionStyle =>
      dispatch(updateCaptionStyle(partialCaptionStyle)),
    receiveAppStateChange: appState =>
      dispatch(receiveAppStateChange(appState)),
  };
}

export default function Container<C: ComponentType<Props>>(
  Component: C
): ComponentType<Props> {
  const fn = (props: Props) => <Component {...props} />;
  return connect(mapStateToProps, mapDispatchToProps)(fn);
}
