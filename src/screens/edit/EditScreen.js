// @flow
import React, { PureComponent } from 'react';
import { View, Alert, AppState as ReactAppState } from 'react-native';
import { autobind } from 'core-decorators';
import { Navigation } from 'react-native-navigation';

import * as Screens from '../../utils/Screens';
import * as Debug from '../../utils/Debug';
import { UI_COLORS, SCREENS } from '../../constants';

import EditScreenVideoPlayer from './EditScreenVideoPlayer';
import EditScreenRichTextOverlay from './EditScreenRichTextOverlay';
import EditScreenExportingOverlay from './EditScreenExportingOverlay';
import EditScreenLoadingOverlay from './EditScreenLoadingOverlay';
import EditScreenLoadingBackground from './EditScreenLoadingBackground';
import SpeechManager from '../../utils/SpeechManager';
import LocaleMenu from '../../components/localization/LocaleMenu';
import Container from './Container';
import * as actions from './actions';

import type { Size, ColorRGBA, Orientation } from '../../types/media';
import type { SpeechTranscription, LocaleObject } from '../../types/speech';
import type { EmitterSubscription, ReactAppStateEnum } from '../../types/react';
import type { Props } from './Container';

type State = {
  videoViewSize: Size,
  orientation: ?Orientation,
  exportProgress: number,
  isDraggingSeekbar: boolean,
  isRichTextEditorVisible: boolean,
  transcriptionReviewScreenIsVisible: boolean,
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
export default class EditScreen extends PureComponent<Props, State> {
  richTextOverlay: ?EditScreenRichTextOverlay;
  state: State = {
    videoViewSize: { width: 0, height: 0 },
    exportProgress: 0,
    orientation: null,
    isDraggingSeekbar: false,
    isRichTextEditorVisible: false,
    transcriptionReviewScreenIsVisible: false,
    isLocaleMenuVisible: false,
  };
  speechManagerDidReceiveTranscriptionListener: ?EmitterSubscription;
  speechManagerDidNotDetectSpeechListener: ?EmitterSubscription;
  speechManagerDidEndListener: ?EmitterSubscription;
  speechManagerDidFailListener: ?EmitterSubscription;
  // speechManagerDidChangeLocaleListener: ?EmitterSubscription;
  transcriptionReviewScreenDidAppearEventListener: any;
  transcriptionReviewScreenDidDisappearEventListener: any;

  async componentDidMount() {
    ReactAppState.addEventListener('change', this.handleAppStateWillChange);
    if (this.props.isSpeechTranscriptionFinal) {
      this.speechManagerDidReceiveFinalSpeechTranscription();
    } else {
      await this.beginSpeechTranscription();
    }
    this.addNavigationListeners();
  }

  componentWillUnmount() {
    ReactAppState.removeEventListener('change', this.handleAppStateWillChange);
    this.removeSpeechListeners();
    this.removeNavigationListeners();
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

  /// MARK -- app state listeners

  handleAppStateWillChange(nextAppState: ReactAppStateEnum) {
    this.props.receiveAppStateChange(nextAppState);
  }

  /// MARK -- navigation listeners

  addNavigationListeners() {
    this.transcriptionReviewScreenDidAppearEventListener = Navigation.events().registerComponentDidAppearListener(
      ({ componentId }) => {
        if (componentId === SCREENS.TRANSCRIPTION_REVIEW_SCREEN) {
          this.setState({
            transcriptionReviewScreenIsVisible: true,
          });
        }
      }
    );
    this.transcriptionReviewScreenDidDisappearEventListener = Navigation.events().registerComponentDidDisappearListener(
      ({ componentId }) => {
        if (componentId === SCREENS.TRANSCRIPTION_REVIEW_SCREEN) {
          this.setState({
            transcriptionReviewScreenIsVisible: false,
          });
        }
      }
    );
  }

  removeNavigationListeners() {
    if (this.transcriptionReviewScreenDidAppearEventListener) {
      this.transcriptionReviewScreenDidAppearEventListener.remove();
    }
    if (this.transcriptionReviewScreenDidDisappearEventListener) {
      this.transcriptionReviewScreenDidDisappearEventListener.remove();
    }
  }

  /// MARK -- speech event listeners

  async beginSpeechTranscription() {
    this.addSpeechListeners();
    await this.props.beginSpeechTranscriptionWithVideoAsset(
      this.props.video.assetID
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
      this.props.receiveSpeechTranscriptionFailure(this.props.video.assetID);
      return;
    }
    this.props.receiveSpeechTranscriptionSuccess(
      this.props.video.assetID,
      transcription
    );
  }

  speechManagerDidReceiveFinalSpeechTranscription() {
    this.removeSpeechListeners();
  }

  speechManagerDidNotDetectSpeech() {
    this.props.receiveSpeechTranscriptionFailure(this.props.video.assetID);
  }

  async richTextEditorDidRequestSave({
    fontSize,
    fontFamily,
    textColor,
    backgroundColor,
  }: {
    fontSize: number,
    fontFamily: string,
    textColor: ColorRGBA,
    backgroundColor: ColorRGBA,
  }) {
    this.props.updateCaptionStyle({
      fontSize,
      fontFamily,
      textColor,
      backgroundColor,
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
    await actions.exportVideo({
      speechTranscription: this.props.speechTranscription,
      videoID: this.props.video.assetID,
      videoViewSize: this.state.videoViewSize,
      duration: this.props.video.duration,
      orientation: this.state.orientation,
      captionStyle: this.props.captionStyle,
      onExportDidFail: this.onExportDidFail,
      onExportDidFinish: this.onExportDidFinish,
      onExportDidUpdateProgress: this.onExportDidUpdateProgress,
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
  }

  onExportDidFail() {
    // TODO: update redux
    Debug.log('Video export failed');
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

  async showCaptionsEditor() {
    this.pauseRichTextEditorCaptions();
    await Screens.pushTranscriptionReviewScreen(
      this.props.componentId,
      this.props.video
    );
  }

  async dismissCaptionsEditor() {
    await Screens.dismissTranscriptionReviewScreen();
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
          videoPlayerParentViewSize={this.state.videoViewSize}
          countryCode={this.props.locale?.country.code}
          isAppInForeground={this.props.isAppInForeground}
          isDeviceLimitedByMemory={this.props.isDeviceLimitedByMemory}
          isCaptionsEditorVisible={
            this.state.transcriptionReviewScreenIsVisible
          }
          isExportingVideo={this.props.isExportingVideo}
          video={this.props.video}
          isSpeechTranscriptionFinal={this.props.isSpeechTranscriptionFinal}
          orientation={this.state.orientation || 'up'}
          captionStyle={this.props.captionStyle}
          speechTranscription={this.props.speechTranscription}
          onRequestChangePlaybackTime={this.seekRichTextEditorCaptionsToTime}
          onRequestChangeOrientation={orientation =>
            this.setState({ orientation })
          }
          onRequestShowRichTextEditor={this.showRichTextEditor}
          onRequestShowCaptionsEditor={() => {
            this.showCaptionsEditor();
          }}
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
          onVideoViewDidUpdateSize={videoViewSize =>
            this.setState({ videoViewSize })
          }
        />
        <EditScreenRichTextOverlay
          ref={ref => {
            this.richTextOverlay = ref;
          }}
          duration={this.props.video.duration}
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
          duration={this.props.video.duration}
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
