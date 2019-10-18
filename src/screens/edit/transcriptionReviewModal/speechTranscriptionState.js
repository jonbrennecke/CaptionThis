// @flow
import React from 'react';
import { connect } from 'react-redux';
import { receiveSpeechTranscriptionSuccess } from '../../../redux/speech/actionCreators';
import {
  isSpeechTranscriptionFinal,
  getSpeechTranscriptionByID,
} from '../../../redux/speech/selectors';

import type { MediaObject } from '@jonbrennecke/react-native-media';
import type { SpeechTranscription } from '@jonbrennecke/react-native-speech';

import type { ComponentType } from 'react';
import type { VideoAssetIdentifier, Dispatch, AppState } from '../../../types';

type OwnProps = {|
  video: MediaObject,
|};

type StateProps = {|
  speechTranscription: ?SpeechTranscription,
  isSpeechTranscriptionFinal: boolean,
|};

type DispatchProps = {|
  receiveSpeechTranscriptionSuccess: (
    VideoAssetIdentifier,
    SpeechTranscription
  ) => void,
|};

export type SpeechTranscriptionHOCProps = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
|};

function mapStateToProps(state: AppState, ownProps: OwnProps): StateProps {
  return {
    isSpeechTranscriptionFinal: isSpeechTranscriptionFinal(
      state,
      ownProps.video.assetID
    ),
    speechTranscription: getSpeechTranscriptionByID(
      state,
      ownProps.video.assetID
    ),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    receiveSpeechTranscriptionSuccess: (id, transcription) =>
      dispatch(receiveSpeechTranscriptionSuccess(id, transcription)),
  };
}

export function wrapWithSpeechTranscriptionState<
  PassThroughProps: Object,
  C: ComponentType<PassThroughProps & SpeechTranscriptionHOCProps>
>(Component: C): ComponentType<PassThroughProps> {
  const fn = props => <Component {...props} />;
  return connect(mapStateToProps, mapDispatchToProps)(fn);
}
