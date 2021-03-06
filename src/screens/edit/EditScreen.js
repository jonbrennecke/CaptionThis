// @flow
import React, { PureComponent } from 'react';
import { View, Alert, AppState as ReactAppState } from 'react-native';
import { autobind } from 'core-decorators';
import { beginSpeechTranscriptionOfAsset } from '@jonbrennecke/react-native-speech';

import * as Debug from '../../utils/Debug';
import { UI_COLORS, SCREENS } from '../../constants';
import EditScreenVideoPlayer from './EditScreenVideoPlayer';
import EditScreenRichTextOverlay from './EditScreenRichTextOverlay';
import { EditScreenExportingOverlay } from './EditScreenExportingOverlay';
import EditScreenLoadingOverlay from './EditScreenLoadingOverlay';
import EditScreenLoadingBackground from './EditScreenLoadingBackground';
import LocaleMenu from '../../components/localization/LocaleMenu';
import { wrapWithEditScreenState } from './editScreenState';
import * as actions from './actions';

import type { LocaleObject } from '@jonbrennecke/react-native-speech';
// eslint-disable-next-line import/named
import type { NavigationEventSubscription } from 'react-navigation';

import type { Size, ColorRGBA, Orientation } from '../../types/media';
import type { ReactAppStateEnum } from '../../types/react';
import type { EditScreenProps } from './editScreenState';

type EditScreenState = {
  videoViewSize: Size,
  orientation: ?Orientation,
  dimensions: ?Size,
  exportProgress: number,
  isDraggingSeekbar: boolean,
  isComponentFocused: boolean,
  isLocaleMenuVisible: boolean,
  captionStyleEditorState: ?{
    playbackTime: number,
  },
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.BLACK,
  },
};

// $FlowFixMe
@wrapWithEditScreenState
// $FlowFixMe
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
    dimensions: null,
    isDraggingSeekbar: false,
    isComponentFocused: false,
    isLocaleMenuVisible: false,
    captionStyleEditorState: null,
  };
  willBlurSubscription: ?NavigationEventSubscription;
  didFocusSubscription: ?NavigationEventSubscription;

  async componentDidMount() {
    ReactAppState.addEventListener('change', this.handleAppStateWillChange);
    this.addNavigationListeners();
    await beginSpeechTranscriptionOfAsset(this.props.video.assetID);
  }

  componentWillUnmount() {
    ReactAppState.removeEventListener('change', this.handleAppStateWillChange);
    this.removeNavigationListeners();
  }

  componentDidUpdate(prevProps: EditScreenProps) {
    const assetID = this.props.video.assetID;
    const hasError = !!this.props.speechTranscriptionErrors.get(assetID);
    const hadErrorPreviously = !!prevProps.speechTranscriptionErrors.get(
      assetID
    );
    if (hasError && !hadErrorPreviously) {
      const noSpeechDetected = this.props.speechTranscriptionIDsWithNoSpeechDetected.has(
        assetID
      );
      noSpeechDetected
        ? this.presentNoSpeechDetectedAlert()
        : this.presentTranscriptionFailureAlert();
      this.props.setSpeechTranscriptionError(assetID, false);
    }
  }

  /// MARK -- app state listeners

  handleAppStateWillChange(nextAppState: ReactAppStateEnum) {
    this.props.receiveAppStateChange(nextAppState);
  }

  /// MARK -- navigation listeners

  addNavigationListeners() {
    this.didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      this.componentDidFocus
    );
    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      this.componentWillBlur
    );
  }

  removeNavigationListeners() {
    if (this.didFocusSubscription) {
      this.didFocusSubscription.remove();
      this.didFocusSubscription = null;
    }
    if (this.willBlurSubscription) {
      this.willBlurSubscription.remove();
      this.willBlurSubscription = null;
    }
  }

  componentDidFocus() {
    this.setState({
      isComponentFocused: true,
    });
  }

  componentWillBlur() {
    this.setState({
      isComponentFocused: false,
    });
  }

  /// MARK -- speech event listeners

  presentTranscriptionFailureAlert() {
    Alert.alert(
      'Failed to generate captions',
      'Unfortunately, something went wrong while processing your video. Try again and speak clearly into the microphone.',
      [
        {
          text: 'OK',
          onPress: () => {
            this.props.navigation.goBack();
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
          onPress: () => {
            this.props.navigation.goBack();
          },
        },
      ],
      { cancelable: false }
    );
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
    this.dismissRichTextEditor();
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
      dimensions: this.state.dimensions,
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

  async showCaptionsEditor() {
    this.pauseRichTextEditorCaptions();
    this.props.navigation.navigate(SCREENS.TRANSCRIPTION_REVIEW_SCREEN, {
      video: this.props.video,
    });
  }

  showRichTextEditor(playbackTime: number) {
    this.setState({
      captionStyleEditorState: {
        playbackTime,
      },
    });
  }

  dismissRichTextEditor() {
    this.setState({
      captionStyleEditorState: null,
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
          isCaptionsEditorVisible={!this.state.isComponentFocused}
          isExportingVideo={this.props.isExportingVideo}
          video={this.props.video}
          isSpeechTranscriptionFinal={speechTranscriptionIsFinal}
          orientation={this.state.orientation || 'up'}
          captionStyle={this.props.captionStyle}
          speechTranscription={speechTranscription}
          onOrientationLoaded={(orientation, dimensions) =>
            this.setState({
              orientation,
              dimensions,
            })
          }
          onRequestShowRichTextEditor={this.showRichTextEditor}
          onRequestShowCaptionsEditor={() => {
            this.showCaptionsEditor();
          }}
          onRequestPopToHomeScreen={() => {
            this.props.navigation.goBack();
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
          captionStyle={this.props.captionStyle}
          speechTranscription={speechTranscription}
          onRequestSave={(...etc) => {
            this.richTextEditorDidRequestSave(...etc);
          }}
          isVisible={!!this.state.captionStyleEditorState}
          {...this.state.captionStyleEditorState}
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
