// @flow
import React from 'react';
import { connect } from 'react-redux';
import { createSpeechStateHOC } from '@jonbrennecke/react-native-speech';

import {
  willExportVideo,
  didExportVideo,
} from '../../redux/media/actionCreators';
import { updateCaptionStyle } from '../../redux/video/actionCreators';
import { isExportingVideo } from '../../redux/media/selectors';
import { getCaptionStyle } from '../../redux/video/selectors';
import { receiveAppStateChange } from '../../redux/device/actionCreators';
import {
  isAppInForeground,
  isDeviceLimitedByMemory,
} from '../../redux/device/selectors';

import type { MediaObject } from '@jonbrennecke/react-native-media';
import type { SpeechStateHOCProps } from '@jonbrennecke/react-native-speech';
// eslint-disable-next-line import/named
import type { NavigationScreenProp } from 'react-navigation';

import type { ComponentType } from 'react';
import type { Dispatch, AppState } from '../../types/redux';
import type { CaptionStyleObject } from '../../types/video';
import type { ReactAppStateEnum } from '../../types/react';

type OwnProps = {|
  navigation: NavigationScreenProp<{
    params: {
      video: MediaObject,
    },
  }>
|};

type StateProps = {|
  captionStyle: CaptionStyleObject,
  isExportingVideo: boolean,
  isAppInForeground: boolean,
  isDeviceLimitedByMemory: boolean,
|};

type DispatchProps = {|
  willExportVideo: () => Promise<void>,
  didExportVideo: () => Promise<void>,
  updateCaptionStyle: typeof updateCaptionStyle,
  receiveAppStateChange: (appState: ReactAppStateEnum) => void,
|};

type EditScreenReduxProps = {| ...OwnProps, ...StateProps, ...DispatchProps |};

type EditScreenExtraProps = {
  video: MediaObject,
};

export type EditScreenProps = EditScreenReduxProps & SpeechStateHOCProps & EditScreenExtraProps;

function mapStateToProps(state: AppState): StateProps {
  return {
    isExportingVideo: isExportingVideo(state),
    isAppInForeground: isAppInForeground(state),
    isDeviceLimitedByMemory: isDeviceLimitedByMemory(state),
    captionStyle: getCaptionStyle(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    willExportVideo: () => dispatch(willExportVideo()),
    didExportVideo: () => dispatch(didExportVideo()),
    updateCaptionStyle: partialCaptionStyle =>
      dispatch(updateCaptionStyle(partialCaptionStyle)),
    receiveAppStateChange: appState =>
      dispatch(receiveAppStateChange(appState)),
  };
}

export function wrapWithEditScreenState<
  PassThroughProps: Object,
  C: ComponentType<EditScreenProps & PassThroughProps>
>(Component: C): ComponentType<PassThroughProps> {
  const wrapWithSpeechState = createSpeechStateHOC(state => state.speech);
  const ComponentWithSpeechState = wrapWithSpeechState(Component);
  const fn = (props: EditScreenProps & PassThroughProps) => {
    return <ComponentWithSpeechState {...props} video={props.navigation.getParam('video')} />;
  };
  return connect(mapStateToProps, mapDispatchToProps)(fn);
}
