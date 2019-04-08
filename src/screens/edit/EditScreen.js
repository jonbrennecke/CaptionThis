// @flow
import React, { Component } from 'react';
import { View, Alert, AppState as ReactAppState } from 'react-native';
import { autobind } from 'core-decorators';
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
import LocaleMenu from '../../components/localization/LocaleMenu';
import Container from './Container';

import type {
  ColorRGBA,
  Orientation,
} from '../../types/media';
import type { SpeechTranscription, LocaleObject } from '../../types/speech';
import type { EmitterSubscription, ReactAppStateEnum } from '../../types/react';
import type { Props } from './Container';

type State = {
  duration: number,
  orientation: ?Orientation,
  exportProgress: number,
  isDraggingSeekbar: boolean,
  isRichTextEditorVisible: boolean,
  isCaptionsEditorVisible: boolean,
  isLocaleMenuVisible: boolean,
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.BLACK,
  },
};

// $FlowFixMe
@Container
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
    isLocaleMenuVisible: false,
  };
  speechManagerDidReceiveTranscriptionListener: ?EmitterSubscription;
  speechManagerDidNotDetectSpeechListener: ?EmitterSubscription;
  speechManagerDidEndListener: ?EmitterSubscription;
  speechManagerDidFailListener: ?EmitterSubscription;
  // speechManagerDidChangeLocaleListener: ?EmitterSubscription;
  exportDidFinishListener: ?EmitterSubscription;
  exportDidFailListener: ?EmitterSubscription;
  exportDidUpdateProgressListener: ?EmitterSubscription;

  async componentDidMount() {
    ReactAppState.addEventListener('change', this.handleAppStateWillChange);
    if (this.props.isSpeechTranscriptionFinal) {
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
    if (
      this.props.speechTranscription?.isFinal &&
      !prevProps.speechTranscription?.isFinal
    ) {
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

  async richTextEditorDidRequestSave({ fontSize, fontFamily, textColor, backgroundColor }: {
    fontSize: number,
    fontFamily: string,
    textColor: ColorRGBA,
    backgroundColor: ColorRGBA,
  }) {
    this.props.updateCaptionStyle({
      fontSize,
      fontFamily,
      textColor,
      backgroundColor
    });
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
      textColor: this.props.captionStyle.textColor,
      backgroundColor: this.props.captionStyle.backgroundColor,
      fontFamily: this.props.captionStyle.fontFamily,
      fontSize: this.props.captionStyle.fontSize,
      lineStyle: this.props.captionStyle.lineStyle,
      duration: this.state.duration,
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
    if (!this.props.speechTranscription) {
      return [];
    }
    return this.props.speechTranscription.segments.map(segment => ({
      duration: segment.duration,
      timestamp: segment.timestamp,
      text: segment.substring,
    }));
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
    requestAnimationFrame(() => {
      if (this.richTextOverlay) {
        this.richTextOverlay.pauseCaptions();
      }
    });
  }

  restartRichTextEditorCaptions() {
    requestAnimationFrame(() => {
      if (this.richTextOverlay) {
        this.richTextOverlay.restartCaptions();
      }
    });
  }

  seekRichTextEditorCaptionsToTime(time: number) {
    if (this.richTextOverlay) {
      this.richTextOverlay.seekCaptionsToTime(time);
    }
  }

  showLocaleMenu() {
    this.setState({
      isLocaleMenuVisible: true,
    });
  }

  dismissLocaleMenu() {
    this.setState({
      isLocaleMenuVisible: false,
    });
  }

  async onRequestChangeLocale(locale: LocaleObject) {
    await this.props.setLocale(locale);
    await this.beginSpeechTranscription();
    this.setState({
      isLocaleMenuVisible: false,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {!this.props.isSpeechTranscriptionFinal && (
          <EditScreenLoadingBackground />
        )}
        <EditScreenVideoPlayer
          countryCode={this.props.locale?.country.code}
          isAppInForeground={this.props.isAppInForeground}
          isDeviceLimitedByMemory={this.props.isDeviceLimitedByMemory}
          isCaptionsEditorVisible={this.state.isCaptionsEditorVisible}
          isExportingVideo={this.props.isExportingVideo}
          video={this.props.video}
          isSpeechTranscriptionFinal={this.props.isSpeechTranscriptionFinal}
          duration={this.state.duration}
          orientation={this.state.orientation || 'up'}
          lineStyle={this.props.captionStyle.lineStyle}
          backgroundStyle={this.props.captionStyle.backgroundStyle}
          textColor={this.props.captionStyle.textColor}
          backgroundColor={this.props.captionStyle.backgroundColor}
          fontFamily={this.props.captionStyle.fontFamily}
          fontSize={this.props.captionStyle.fontSize}
          speechTranscription={this.props.speechTranscription}
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
          onLocaleButtonPress={this.showLocaleMenu}
        />
        <EditScreenRichTextOverlay
          ref={ref => {
            this.richTextOverlay = ref;
          }}
          isReadyToPlay={this.props.isSpeechTranscriptionFinal}
          duration={this.state.duration}
          isVisible={this.state.isRichTextEditorVisible}
          captionStyle={this.props.captionStyle}
          speechTranscription={this.props.speechTranscription}
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
          isVisible={!this.props.isSpeechTranscriptionFinal}
          video={this.props.video}
        />
        <EditScreenEditCaptionsOverlay
          videoID={this.props.video.id}
          speechTranscription={this.props.speechTranscription}
          isVisible={this.state.isCaptionsEditorVisible}
          onRequestDismissModal={this.dismissCaptionsEditor}
          receiveSpeechTranscriptionSuccess={
            this.props.receiveSpeechTranscriptionSuccess
          }
        />
        <LocaleMenu
          isVisible={this.state.isLocaleMenuVisible}
          locale={this.props.locale}
          onRequestDismiss={this.dismissLocaleMenu}
          onRequestChangeLocale={locale => {
            this.onRequestChangeLocale(locale);
          }}
        />
      </View>
    );
  }
}
