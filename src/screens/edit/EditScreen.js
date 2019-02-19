// @flow
import React, { Component } from 'react';
import { View, Alert, AppState as ReactAppState } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import * as Debug from '../../utils/Debug';
import VideoExportManager from '../../utils/VideoExportManager';
import { UI_COLORS } from '../../constants';

import EditScreenVideoPlayer from './EditScreenVideoPlayer';
import EditScreenRichTextOverlay from './EditScreenRichTextOverlay';
import EditScreenExportingOverlay from './EditScreenExportingOverlay';
import EditScreenLoadingOverlay from './EditScreenLoadingOverlay';
import EditScreenLoadingBackground from './EditScreenLoadingBackground';
import EditScreenEditCaptionsOverlay from './EditScreenEditCaptionsOverlay';
import SpeechManager from '../../utils/SpeechManager';
import {
  willExportVideo,
  didExportVideo,
} from '../../redux/media/actionCreators';
import {
  beginSpeechTranscriptionWithVideoAsset,
  receiveSpeechTranscriptionSuccess,
  receiveSpeechTranscriptionFailure,
} from '../../redux/speech/actionCreators';
import {
  receiveUserSelectedFontFamily,
  receiveUserSelectedTextColor,
  receiveUserSelectedBackgroundColor,
  receiveUserSelectedFontSize,
} from '../../redux/video/actionCreators';
import { isExportingVideo } from '../../redux/media/selectors';
import {
  getSpeechTranscriptions,
  didSpeechRecognitionFail,
} from '../../redux/speech/selectors';
import {
  getBackgroundColor,
  getTextColor,
  getFontFamily,
  getFontSize,
  getLineStyle,
} from '../../redux/video/selectors';
import { receiveAppStateChange } from '../../redux/device/actionCreators';
import {
  isAppInForeground,
  isDeviceLimitedByMemory,
} from '../../redux/device/selectors';

import type {
  VideoAssetIdentifier,
  VideoObject,
  ColorRGBA,
  Orientation,
} from '../../types/media';
import type { Dispatch, AppState } from '../../types/redux';
import type { SpeechTranscription } from '../../types/speech';
import type { LineStyle } from '../../types/video';
import type { EmitterSubscription, ReactAppStateEnum } from '../../types/react';

type State = {
  duration: number,
  orientation: ?Orientation,
  exportProgress: number,
  isDraggingSeekbar: boolean,
  isRichTextEditorVisible: boolean,
  isCaptionsEditorVisible: boolean,
};

type OwnProps = {
  componentId: string,
  video: VideoObject,
};

type StateProps = {
  speechTranscriptions: Map<VideoAssetIdentifier, SpeechTranscription>,
  fontFamily: string,
  backgroundColor: ColorRGBA,
  textColor: ColorRGBA,
  isExportingVideo: boolean,
  fontSize: number,
  didSpeechRecognitionFail: boolean,
  lineStyle: LineStyle,
  isAppInForeground: boolean,
  isDeviceLimitedByMemory: boolean,
};

type DispatchProps = {
  beginSpeechTranscriptionWithVideoAsset: VideoAssetIdentifier => Promise<void>,
  receiveSpeechTranscriptionSuccess: (
    VideoAssetIdentifier,
    SpeechTranscription
  ) => void,
  receiveSpeechTranscriptionFailure: VideoAssetIdentifier => void,
  willExportVideo: () => Promise<void>,
  didExportVideo: () => Promise<void>,
  receiveUserSelectedFontFamily: (fontFamily: string) => void,
  receiveUserSelectedTextColor: (color: ColorRGBA) => void,
  receiveUserSelectedBackgroundColor: (color: ColorRGBA) => void,
  receiveUserSelectedFontSize: (fontSize: number) => void,
  receiveAppStateChange: (appState: ReactAppStateEnum) => void,
};

type Props = OwnProps & StateProps & DispatchProps;

const styles = {
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.BLACK,
  },
};

function mapStateToProps(state: AppState): StateProps {
  return {
    speechTranscriptions: getSpeechTranscriptions(state),
    fontFamily: getFontFamily(state),
    backgroundColor: getBackgroundColor(state),
    textColor: getTextColor(state),
    isExportingVideo: isExportingVideo(state),
    fontSize: getFontSize(state),
    didSpeechRecognitionFail: didSpeechRecognitionFail(state),
    lineStyle: getLineStyle(state),
    isAppInForeground: isAppInForeground(state),
    isDeviceLimitedByMemory: isDeviceLimitedByMemory(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    beginSpeechTranscriptionWithVideoAsset: (id: VideoAssetIdentifier) =>
      dispatch(beginSpeechTranscriptionWithVideoAsset(id)),
    receiveSpeechTranscriptionSuccess: (
      id: VideoAssetIdentifier,
      transcription: SpeechTranscription
    ) => dispatch(receiveSpeechTranscriptionSuccess(id, transcription)),
    receiveSpeechTranscriptionFailure: (id: VideoAssetIdentifier) =>
      dispatch(receiveSpeechTranscriptionFailure(id)),
    willExportVideo: () => dispatch(willExportVideo()),
    didExportVideo: () => dispatch(didExportVideo()),
    receiveUserSelectedFontFamily: (fontFamily: string) =>
      dispatch(receiveUserSelectedFontFamily(fontFamily)),
    receiveUserSelectedTextColor: (color: ColorRGBA) =>
      dispatch(receiveUserSelectedTextColor(color)),
    receiveUserSelectedBackgroundColor: (color: ColorRGBA) =>
      dispatch(receiveUserSelectedBackgroundColor(color)),
    receiveUserSelectedFontSize: (fontSize: number) =>
      dispatch(receiveUserSelectedFontSize(fontSize)),
    receiveAppStateChange: (appState: ReactAppStateEnum) =>
      dispatch(receiveAppStateChange(appState)),
  };
}

// $FlowFixMe
@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class EditScreen extends Component<Props, State> {
  richTextOverlay: ?EditScreenRichTextOverlay;
  state: State = {
    duration: 0,
    exportProgress: 0,
    orientation: null,
    isDraggingSeekbar: false,
    isRichTextEditorVisible: false,
    isCaptionsEditorVisible: false,
  };
  speechManagerDidReceiveTranscriptionListener: ?EmitterSubscription;
  speechManagerDidNotDetectSpeechListener: ?EmitterSubscription;
  speechManagerDidEndListener: ?EmitterSubscription;
  speechManagerDidFailListener: ?EmitterSubscription;
  exportDidFinishListener: ?EmitterSubscription;
  exportDidFailListener: ?EmitterSubscription;
  exportDidUpdateProgressListener: ?EmitterSubscription;

  async componentDidMount() {
    ReactAppState.addEventListener('change', this.handleAppStateWillChange);
    if (this.hasFinalSpeechTranscription()) {
      this.speechManagerDidReceiveFinalSpeechTranscription();
    } else {
      await this.beginSpeechTranscription();
    }
  }

  componentWillUnmount() {
    ReactAppState.removeEventListener('change', this.handleAppStateWillChange);
    this.removeSpeechListeners();
    this.removeExportListeners();
  }

  componentDidUpdate(prevProps: Props) {
    const speechTranscription = this.getSpeechTranscription(this.props);
    const prevSpeechTranscription = this.getSpeechTranscription(prevProps);
    if (speechTranscription?.isFinal && !prevSpeechTranscription?.isFinal) {
      this.speechManagerDidReceiveFinalSpeechTranscription();
    }
    if (
      this.props.didSpeechRecognitionFail &&
      !prevProps.didSpeechRecognitionFail
    ) {
      this.presentTranscriptionFailureAlert();
    }
  }

  handleAppStateWillChange(nextAppState: ReactAppStateEnum) {
    this.props.receiveAppStateChange(nextAppState);
  }

  async beginSpeechTranscription() {
    this.addSpeechListeners();
    await this.props.beginSpeechTranscriptionWithVideoAsset(
      this.props.video.id
    );
  }

  addSpeechListeners() {
    this.speechManagerDidReceiveTranscriptionListener = SpeechManager.addDidReceiveSpeechTranscriptionListener(
      this.speechManagerDidReceiveSpeechTranscription
    );
    this.speechManagerDidNotDetectSpeechListener = SpeechManager.addDidNotDetectSpeechListener(
      this.speechManagerDidNotDetectSpeech
    );
    this.speechManagerDidEndListener = SpeechManager.addDidEndListener(
      this.speechManagerDidEnd
    );
    this.speechManagerDidFailListener = SpeechManager.addDidFailListener(
      this.speechManagerDidFail
    );
  }

  removeSpeechListeners() {
    this.speechManagerDidReceiveTranscriptionListener &&
      this.speechManagerDidReceiveTranscriptionListener.remove();
    this.speechManagerDidReceiveTranscriptionListener = null;
    this.speechManagerDidNotDetectSpeechListener &&
      this.speechManagerDidNotDetectSpeechListener.remove();
    this.speechManagerDidNotDetectSpeechListener = null;
    this.speechManagerDidEndListener &&
      this.speechManagerDidEndListener.remove();
    this.speechManagerDidEndListener = null;
    this.speechManagerDidFailListener &&
      this.speechManagerDidFailListener.remove();
    this.speechManagerDidFailListener = null;
  }

  presentTranscriptionFailureAlert() {
    Alert.alert(
      'Failed to generate captions',
      "Unfortunately, We weren't able to detect any speech. Try again and speak clearly into the microphone.",
      [
        {
          text: 'OK',
          onPress: async () => {
            await Navigation.dismissAllModals();
            await Navigation.popToRoot(this.props.componentId);
          },
        },
      ],
      { cancelable: false }
    );
  }

  speechManagerDidEnd() {
    // NOTE: noop
  }

  speechManagerDidFail() {
    Debug.log('Speech transcription failed.');
    this.removeSpeechListeners();
    this.popToHomeScreen();
  }

  speechManagerDidReceiveSpeechTranscription(
    transcription: SpeechTranscription
  ) {
    if (!transcription) {
      this.props.receiveSpeechTranscriptionFailure(this.props.video.id);
      return;
    }
    this.props.receiveSpeechTranscriptionSuccess(
      this.props.video.id,
      transcription
    );
  }

  speechManagerDidReceiveFinalSpeechTranscription() {
    this.removeSpeechListeners();
  }

  speechManagerDidNotDetectSpeech() {
    this.props.receiveSpeechTranscriptionFailure(this.props.video.id);
  }

  async richTextEditorDidRequestSave(params: {
    fontSize: number,
    fontFamily: string,
    textColor: ColorRGBA,
    backgroundColor: ColorRGBA,
  }) {
    this.props.receiveUserSelectedFontSize(params.fontSize);
    this.props.receiveUserSelectedFontFamily(params.fontFamily);
    this.props.receiveUserSelectedTextColor(params.textColor);
    this.props.receiveUserSelectedBackgroundColor(params.backgroundColor);
    this.setState({
      isRichTextEditorVisible: false,
    });
  }

  async popToHomeScreen() {
    await Navigation.popToRoot(this.props.componentId);
  }

  async onDidPressExportButton() {
    await this.exportVideo();
  }

  async exportVideo() {
    this.props.willExportVideo();
    this.addExportListeners();
    await VideoExportManager.exportVideo({
      video: this.props.video.id,
      textSegments: this.textOverlayParams(),
      textColor: this.props.textColor,
      backgroundColor: this.props.backgroundColor,
      fontFamily: this.props.fontFamily,
      fontSize: this.props.fontSize,
      duration: this.state.duration,
      lineStyle: this.props.lineStyle,
      orientation: this.state.orientation || 'up',
    });
  }

  onExportDidUpdateProgress(progress: number) {
    Debug.log(`Video export progress updated. Progress = ${progress}`);
    this.setState({
      exportProgress: progress,
    });
  }

  onExportDidFinish() {
    Debug.log('Video export finished');
    this.props.didExportVideo();
    this.removeExportListeners();
  }

  onExportDidFail() {
    // TODO: update redux
    Debug.log('Video export failed');
    this.removeExportListeners();
  }

  addExportListeners() {
    this.exportDidFinishListener = VideoExportManager.addDidFinishListener(
      this.onExportDidFinish
    );
    this.exportDidFailListener = VideoExportManager.addDidFailListener(
      this.onExportDidFinish
    );
    this.exportDidUpdateProgressListener = VideoExportManager.addDidUpdateProgressListener(
      this.onExportDidUpdateProgress
    );
  }

  removeExportListeners() {
    this.exportDidFinishListener && this.exportDidFinishListener.remove();
    this.exportDidFinishListener = null;
    this.exportDidFailListener && this.exportDidFailListener.remove();
    this.exportDidFailListener = null;
    this.exportDidUpdateProgressListener &&
      this.exportDidUpdateProgressListener.remove();
    this.exportDidUpdateProgressListener = null;
  }

  textOverlayParams() {
    const speechTranscription = this.getSpeechTranscription();
    if (!speechTranscription) {
      return [];
    }
    return speechTranscription.segments.map(segment => ({
      duration: segment.duration,
      timestamp: segment.timestamp,
      text: segment.substring,
    }));
  }

  isReadyToPlay(): boolean {
    return this.hasFinalSpeechTranscription();
  }

  getSpeechTranscription(props?: Props = this.props): ?SpeechTranscription {
    const {
      speechTranscriptions,
      video: { id },
    } = props;
    if (!speechTranscriptions.has(id)) {
      return null;
    }
    return speechTranscriptions.get(id);
  }

  hasFinalSpeechTranscription(): boolean {
    const speechTranscription = this.getSpeechTranscription();
    return !!(speechTranscription && speechTranscription.isFinal);
  }

  showCaptionsEditor() {
    this.setState({
      isCaptionsEditorVisible: true,
    });
  }

  dismissCaptionsEditor() {
    this.setState({
      isCaptionsEditorVisible: false,
    });
  }

  showRichTextEditor() {
    this.setState({
      isRichTextEditorVisible: true,
    });
  }

  dismissRichTextEditor() {
    this.setState({
      isRichTextEditorVisible: false,
    });
  }

  pauseRichTextEditorCaptions() {
    if (this.richTextOverlay) {
      this.richTextOverlay.pauseCaptions();
    }
  }

  restartRichTextEditorCaptions() {
    if (this.richTextOverlay) {
      this.richTextOverlay.restartCaptions();
    }
  }

  seekRichTextEditorCaptionsToTime(time: number) {
    if (this.richTextOverlay) {
      this.richTextOverlay.seekCaptionsToTime(time);
    }
  }

  render() {
    const hasFinalTranscription = this.hasFinalSpeechTranscription();
    const transcription = this.getSpeechTranscription();
    return (
      <View style={styles.container}>
        {!hasFinalTranscription && <EditScreenLoadingBackground />}
        <EditScreenVideoPlayer
          isAppInForeground={this.props.isAppInForeground}
          isDeviceLimitedByMemory={this.props.isDeviceLimitedByMemory}
          isCaptionsEditorVisible={this.state.isCaptionsEditorVisible}
          isExportingVideo={this.props.isExportingVideo}
          video={this.props.video}
          isReadyToPlay={hasFinalTranscription}
          duration={this.state.duration}
          orientation={this.state.orientation || 'up'}
          lineStyle={this.props.lineStyle}
          textColor={this.props.textColor}
          backgroundColor={this.props.backgroundColor}
          fontFamily={this.props.fontFamily}
          fontSize={this.props.fontSize}
          speechTranscription={transcription}
          onRequestChangeDuration={duration => this.setState({ duration })}
          onRequestChangePlaybackTime={this.seekRichTextEditorCaptionsToTime}
          onRequestChangeOrientation={orientation =>
            this.setState({ orientation })
          }
          onRequestShowRichTextEditor={this.showRichTextEditor}
          onRequestShowCaptionsEditor={this.showCaptionsEditor}
          onRequestPopToHomeScreen={() => {
            // TODO: handle awaiting this promise
            this.popToHomeScreen();
          }}
          onRequestExport={() => {
            // TODO: handle awaiting this promise
            this.onDidPressExportButton();
          }}
          onDidRestartCaptions={this.restartRichTextEditorCaptions}
          onDidPauseCaptions={this.pauseRichTextEditorCaptions}
        />
        <EditScreenRichTextOverlay
          ref={ref => {
            this.richTextOverlay = ref;
          }}
          hasFinalTranscription={hasFinalTranscription}
          duration={this.state.duration}
          isVisible={this.state.isRichTextEditorVisible}
          lineStyle={this.props.lineStyle}
          textColor={this.props.textColor}
          backgroundColor={this.props.backgroundColor}
          fontFamily={this.props.fontFamily}
          fontSize={this.props.fontSize}
          speechTranscription={transcription}
          onRequestSave={(...etc) => {
            this.richTextEditorDidRequestSave(...etc);
          }}
        />
        <EditScreenExportingOverlay
          isVisible={this.props.isExportingVideo}
          progress={this.state.exportProgress}
          onDidDismiss={() => this.setState({ exportProgress: 0 })}
        />
        <EditScreenLoadingOverlay
          isVisible={!hasFinalTranscription}
          video={this.props.video}
        />
        <EditScreenEditCaptionsOverlay
          videoAssetIdentifier={this.props.video.id}
          speechTranscriptions={this.props.speechTranscriptions}
          isVisible={this.state.isCaptionsEditorVisible}
          onRequestDismissModal={this.dismissCaptionsEditor}
          receiveSpeechTranscriptionSuccess={
            this.props.receiveSpeechTranscriptionSuccess
          }
        />
      </View>
    );
  }
}
