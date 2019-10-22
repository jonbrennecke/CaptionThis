// @flow
import React from 'react';
import { connect } from 'react-redux';
import {
  selectAssets,
  createMediaStateHOC,
} from '@jonbrennecke/react-native-media';
import { createSpeechStateHOC } from '@jonbrennecke/react-native-speech';

import { arePermissionsGranted } from '../../redux/onboarding/selectors';
import { receiveFinishedVideo } from '../../redux/media/actionCreators';
import { loadDeviceInfo } from '../../redux/device/actionCreators';
import { getCurrentVideo } from '../../redux/media/selectors';
import { updateCaptionStyle } from '../../redux/video/actionCreators';
import { getCaptionStyle } from '../../redux/video/selectors';
import { wrapWithCameraState } from './cameraState';

import type {
  MediaObject,
  MediaStateHOCProps,
} from '@jonbrennecke/react-native-media';
import type { SpeechStateHOCProps } from '@jonbrennecke/react-native-speech';

import type { CameraStateProps } from './cameraState';
import type { ComponentType } from 'react';
import type { Dispatch, AppState } from '../../types/redux';
import type { VideoAssetIdentifier } from '../../types/media';
import type { CaptionStyleObject } from '../../types/video';

type OwnProps = {};

type StateProps = {
  thumbnailVideoID: ?string,
  arePermissionsGranted: boolean,
  currentVideo: ?VideoAssetIdentifier,
  captionStyle: CaptionStyleObject,
};

type DispatchProps = {
  loadDeviceInfo: () => Promise<void>,
  receiveFinishedVideo: MediaObject => void,
  updateCaptionStyle: typeof updateCaptionStyle,
};

export type HomeScreenStateReduxProps = OwnProps & StateProps & DispatchProps;

export type HomeScreenStateProps = HomeScreenStateReduxProps &
  SpeechStateHOCProps &
  CameraStateProps &
  MediaStateHOCProps;

function mapStateToProps(state: AppState): StateProps {
  const assets = selectAssets(state.newMedia);
  const thumbnailVideoID = assets.first()?.assetID;
  return {
    thumbnailVideoID,
    arePermissionsGranted: arePermissionsGranted(state),
    currentVideo: getCurrentVideo(state),
    captionStyle: getCaptionStyle(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    loadDeviceInfo: () => dispatch(loadDeviceInfo()),
    receiveFinishedVideo: () => dispatch(receiveFinishedVideo()),
    updateCaptionStyle: partialCaptionStyle =>
      dispatch(updateCaptionStyle(partialCaptionStyle)),
  };
}

export function wrapWithHomeScreenState<
  PassThroughProps: Object,
  C: ComponentType<HomeScreenStateProps & PassThroughProps>
>(wrappedComponent: C): ComponentType<PassThroughProps> {
  const wrapWithMediaState = createMediaStateHOC(state => state.newMedia);
  const wrapWithSpeechState = createSpeechStateHOC(state => state.speech);
  const componentWithSpeechState = wrapWithSpeechState(wrappedComponent);
  const componentWithCameraState = wrapWithCameraState(
    componentWithSpeechState
  );
  const ComponentWithMediaState = wrapWithMediaState(componentWithCameraState);
  const fn = (props: HomeScreenStateReduxProps & PassThroughProps) => (
    <ComponentWithMediaState {...props} />
  );
  return connect(mapStateToProps, mapDispatchToProps)(fn);
}
