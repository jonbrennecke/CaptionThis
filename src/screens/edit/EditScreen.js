// @flow
import React, { PureComponent } from 'react';
import { View, Alert, AppState as ReactAppState } from 'react-native';
import { autobind } from 'core-decorators';
import { Navigation } from 'react-native-navigation';
import { beginSpeechTranscriptionOfAsset } from '@jonbrennecke/react-native-speech';

import * as Screens from '../../utils/Screens';
import * as Debug from '../../utils/Debug';
import { UI_COLORS, SCREENS } from '../../constants';

import EditScreenVideoPlayer from './EditScreenVideoPlayer';
import EditScreenRichTextOverlay from './EditScreenRichTextOverlay';
import EditScreenExportingOverlay from './EditScreenExportingOverlay';
import EditScreenLoadingOverlay from './EditScreenLoadingOverlay';
import EditScreenLoadingBackground from './EditScreenLoadingBackground';
import LocaleMenu from '../../components/localization/LocaleMenu';
import { wrapWithEditScreenState } from './editScreenState';
import * as actions from './actions';

import type { LocaleObject } from '@jonbrennecke/react-native-speech';

import type { Size, ColorRGBA, Orientation } from '../../types/media';
import type { ReactAppStateEnum } from '../../types/react';
import type { EditScreenProps } from './editScreenState';

type EditScreenState = {
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
@wrapWithEditScreenState
@autobind
export default class EditScreen extends PureComponent<
  EditScreenProps,
  EditScreenState
> {
  richTextOverlay: ?EditScreenRichTextOverlay;
  state: EditScreenState = {
    videoViewSize: { width: 0, height: 0 },
    exportProgress: 0,
    orientation: null,
    isDraggingSeekbar: false,
    isRichTextEditorVisible: false,
    transcriptionReviewScreenIsVisible: false,
    isLocaleMenuVisible: false,
  };
  transcriptionReviewScreenDidAppearEventListener: any;
  transcriptionReviewScreenDidDisappearEventListener: any;

  async componentDidMount() {
    ReactAppState.addEventListener('change', this.handleAppStateWillChange);
    await beginSpeechTranscriptionOfAsset(this.props.video.assetID);
    this.addNavigationListeners();
  }

  componentWillUnmount() {
    ReactAppState.removeEventListener('change', this.handleAppStateWillChange);
    this.removeNavigationListeners();
  }

  componentDidUpdate(prevProps: EditScreenProps) {
    const assetID = this.props.video.assetID;
    const hasError = this.props.speechTranscriptionErrors.has(assetID);
    const hadErrorPreviously = prevProps.speechTranscriptionErrors.has(assetID);
    if (hasError && !hadErrorPreviously) {
      const noSpeechDetected = this.props.speechTranscriptionIDsWithNoSpeechDetected.has(
        assetID
      );
      noSpeechDetected
        ? this.presentNoSpeechDetectedAlert()
        : this.presentTranscriptionFailureAlert();
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

  presentTranscriptionFailureAlert() {
    Alert.alert(
      'Failed to generate captions',
      'Unfortunately, something went wrong while processing your video. Try again and speak clearly into the microphone.',
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

  presentNoSpeechDetectedAlert() {
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

  speechManagerDidFail() {
    Debug.log('Speech transcription failed.');
    this.popToHomeScreen();
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
    const speechTranscription = this.props.speechTranscriptions.get(
      this.props.video.assetID
    );
    if (!speechTranscription) {
      return;
    }
    await actions.exportVideo({
      speechTranscription,
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
    const speechTranscription = this.props.speechTranscriptions.get(
      this.props.video.assetID
    );
    if (!speechTranscription) {
      return [];
    }
    return speechTranscription.segments.map(segment => ({
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
    await beginSpeechTranscriptionOfAsset(this.props.video.assetID);
    this.setState({
      isLocaleMenuVisible: false,
    });
  }

  render() {
    const speechTranscription = this.props.speechTranscriptions.get(
      this.props.video.assetID
    );
    const speechTranscriptionIsFinal =
      !!speechTranscription && speechTranscription.isFinal;
    return (
      <View style={styles.container}>
        {!speechTranscriptionIsFinal && <EditScreenLoadingBackground />}
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
          isSpeechTranscriptionFinal={speechTranscriptionIsFinal}
          orientation={this.state.orientation || 'up'}
          captionStyle={this.props.captionStyle}
          speechTranscription={speechTranscription}
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
          speechTranscription={speechTranscription}
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
          isVisible={!speechTranscriptionIsFinal}
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
