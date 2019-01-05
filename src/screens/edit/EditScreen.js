// @flow
import React, { Component } from 'react';
import { View, SafeAreaView, Dimensions } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import { UI_COLORS } from '../../constants';
import ScreenGradients from '../../components/screen-gradients/ScreenGradients';
import VideoPlayerView from '../../components/video-player-view/VideoPlayerView';
import RecordingTranscriptionView from '../../components/recording-transcription-view/RecordingTranscriptionView';
import VideoSeekbar from '../../components/video-seekbar/VideoSeekbar';
import EditScreenTopControls from './EditScreenTopControls';
import EditScreenRichTextOverlay from './EditScreenRichTextOverlay';
import EditScreenEditControls from './EditScreenEditControls';
import EditScreenLoadingOverlay from './EditScreenLoadingOverlay';
import EditScreenExportingOverlay from './EditScreenExportingOverlay';
import SpeechManager from '../../utils/SpeechManager';
import * as Screens from '../../utils/Screens';
import {
  beginSpeechTranscriptionWithVideoAsset,
  receiveSpeechTranscriptionSuccess,
  receiveSpeechTranscriptionFailure,
  exportVideo,
  receiveUserSelectedFontFamily,
  receiveUserSelectedTextColor,
  receiveUserSelectedBackgroundColor,
} from '../../redux/media/actionCreators';
import {
  getBackgroundColor,
  getTextColor,
  getSpeechTranscriptions,
  getFontFamily,
  isExportingVideo,
} from '../../redux/media/selectors';

import type { VideoAssetIdentifier, ColorRGBA } from '../../types/media';
import type { Dispatch, AppState } from '../../types/redux';
import type { Return } from '../../types/util';
import type { SpeechTranscription } from '../../types/speech';
import type { ExportParams } from '../../utils/VideoExportManager';

type State = {
  startTimeSeconds: number,
  durationSeconds: number,
  playbackTimeSeconds: number,
  isVideoPlaying: boolean,
  isDraggingSeekbar: boolean,
  showRichTextOverlay: boolean,
};

type OwnProps = {
  componentId: string,
  videoAssetIdentifier: VideoAssetIdentifier,
};

type StateProps = {
  speechTranscriptions: Map<VideoAssetIdentifier, SpeechTranscription>,
  fontFamily: string,
  backgroundColor: ColorRGBA,
  textColor: ColorRGBA,
  isExportingVideo: boolean,
};

type DispatchProps = {
  beginSpeechTranscriptionWithVideoAsset: VideoAssetIdentifier => Promise<void>,
  receiveSpeechTranscriptionSuccess: (
    VideoAssetIdentifier,
    SpeechTranscription
  ) => void,
  receiveSpeechTranscriptionFailure: VideoAssetIdentifier => void,
  exportVideo: ExportParams => Promise<void>,
  receiveUserSelectedFontFamily: (fontFamily: string) => void,
  receiveUserSelectedTextColor: (color: ColorRGBA) => void,
  receiveUserSelectedBackgroundColor: (color: ColorRGBA) => void,
};

type Props = OwnProps & StateProps & DispatchProps;

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = {
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.BLACK,
  },
  safeArea: {
    flex: 1,
  },
  videoWrap: {
    borderRadius: 10,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 125,
    overflow: 'hidden',
    backgroundColor: UI_COLORS.DARK_GREY,
  },
  videoPlayer: {
    flex: 1,
  },
  transcription: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 100,
  },
  playbackControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  editControls: {
    flex: 1,
    paddingVertical: 10,
  },
  editTopControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  scrollView: {
    flex: 1,
  },
  seekbar: {
    marginBottom: 15,
    flexGrow: 1,
  },
  seekbarWrap: {
    flexDirection: 'row',
  },
  pauseButton: {
    width: 45,
    height: 45,
    marginRight: 10,
  },
};

function mapStateToProps(state: AppState): StateProps {
  return {
    speechTranscriptions: getSpeechTranscriptions(state),
    fontFamily: getFontFamily(state),
    backgroundColor: getBackgroundColor(state),
    textColor: getTextColor(state),
    isExportingVideo: isExportingVideo(state),
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
    exportVideo: (exportParams: ExportParams) =>
      dispatch(exportVideo(exportParams)),
    receiveUserSelectedFontFamily: (fontFamily: string) => dispatch(receiveUserSelectedFontFamily(fontFamily)),
    receiveUserSelectedTextColor: (color: ColorRGBA) => dispatch(receiveUserSelectedTextColor(color)),
    receiveUserSelectedBackgroundColor: (color: ColorRGBA) => dispatch(receiveUserSelectedBackgroundColor(color)),
  };
}

// $FlowFixMe
@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class EditScreen extends Component<Props, State> {
  state: State = {
    startTimeSeconds: 0,
    playbackTimeSeconds: 0,
    durationSeconds: 0,
    isVideoPlaying: false,
    isDraggingSeekbar: false,
    showRichTextOverlay: false,
  };

  // eslint-disable-next-line flowtype/generic-spacing
  speechTranscriptionSubscription: ?Return<
    typeof SpeechManager.addSpeechTranscriptionListener
  >;

  componentDidMount() {
    this.speechTranscriptionSubscription = SpeechManager.addSpeechTranscriptionListener(
      this.speechManagerDidReceiveSpeechTranscription
    );
  }

  componentWillUnmount() {
    if (this.speechTranscriptionSubscription) {
      this.speechTranscriptionSubscription.remove();
    }
  }

  videoPlayerDidBecomeReadyToPlay(duration: number) {
    this.setState({ durationSeconds: duration, isVideoPlaying: true });
    this.props.beginSpeechTranscriptionWithVideoAsset(
      this.props.videoAssetIdentifier
    );
  }

  videoPlayerDidFailToLoad() {
    this.setState({ isVideoPlaying: false });
  }

  videoPlayerDidPause() {
    this.setState({ isVideoPlaying: false });
  }

  videoPlayerDidUpdatePlaybackTime(playbackTime: number, duration: number) {
    if (this.state.isDraggingSeekbar) {
      return;
    }
    this.setState({
      playbackTimeSeconds: playbackTime,
      durationSeconds: duration,
    });
  }

  speechManagerDidReceiveSpeechTranscription(
    transcription: SpeechTranscription
  ) {
    if (!transcription) {
      this.props.receiveSpeechTranscriptionFailure(
        this.props.videoAssetIdentifier
      );
      return;
    }
    this.props.receiveSpeechTranscriptionSuccess(
      this.props.videoAssetIdentifier,
      transcription
    );
  }

  seekBarDidSeekToTime(timeSeconds: number) {
    this.setState({
      playbackTimeSeconds: timeSeconds,
      startTimeSeconds: timeSeconds,
    });
  }

  async richTextEditorDidRequestSave(params: {
    fontSize: number,
    fontFamily: string,
    textColor: ColorRGBA,
    backgroundColor: ColorRGBA,
  }) {
    // TODO save fontSize
    this.props.receiveUserSelectedFontFamily(params.fontFamily);
    this.props.receiveUserSelectedTextColor(params.textColor);
    this.props.receiveUserSelectedBackgroundColor(params.backgroundColor);
  }

  onDidPressBackButton() {
    Navigation.pop(this.props.componentId);
  }

  onDidPressExportButton() {
    this.exportVideo();
  }

  async exportVideo() {
    await this.props.exportVideo({
      video: this.props.videoAssetIdentifier,
      textSegments: this.textOverlayParams(),
      textColor: this.props.textColor,
      backgroundColor: this.props.backgroundColor,
      fontFamily: this.props.fontFamily,
    });
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

  getSpeechTranscription(): ?SpeechTranscription {
    const { speechTranscriptions, videoAssetIdentifier: key } = this.props;
    if (!speechTranscriptions.has(key)) {
      return null;
    }
    return speechTranscriptions.get(key);
  }

  async showEditTranscriptionModal() {
    await Screens.showEditTranscriptionModal(this.props.videoAssetIdentifier);
  }

  render() {
    const speechTranscription = this.getSpeechTranscription();
    const hasFinalTranscription =
      speechTranscription && speechTranscription.isFinal;
    return (
      <View style={styles.container}>
        <ScreenGradients />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.videoWrap}>
            <VideoPlayerView
              style={styles.videoPlayer}
              isPlaying={this.state.isVideoPlaying}
              startPosition={this.state.startTimeSeconds}
              videoAssetIdentifier={this.props.videoAssetIdentifier}
              onVideoDidBecomeReadyToPlay={this.videoPlayerDidBecomeReadyToPlay}
              onVideoDidFailToLoad={this.videoPlayerDidFailToLoad}
              onVideoDidPause={this.videoPlayerDidPause}
              onVideoDidUpdatePlaybackTime={
                this.videoPlayerDidUpdatePlaybackTime
              }
            />
            <EditScreenTopControls
              style={styles.editTopControls}
              onBackButtonPress={this.onDidPressBackButton}
              onExportButtonPress={this.onDidPressExportButton}
            />
            {hasFinalTranscription && (
              <RecordingTranscriptionView
                style={styles.transcription}
                textColor={this.props.textColor}
                backgroundColor={this.props.backgroundColor}
                fontFamily={this.props.fontFamily}
                speechTranscription={this.getSpeechTranscription()}
                onPress={() => {
                  this.showEditTranscriptionModal();
                }}
              />
            )}
            <EditScreenEditControls
              style={styles.playbackControls}
              onPressRichTextButton={() =>
                this.setState({
                  showRichTextOverlay: !this.state.showRichTextOverlay,
                })
              }
            />
          </View>
          <View style={styles.editControls}>
            <View style={styles.seekbarWrap}>
              <VideoSeekbar
                style={styles.seekbar}
                duration={this.state.durationSeconds}
                playbackTime={this.state.playbackTimeSeconds}
                videoAssetIdentifier={this.props.videoAssetIdentifier}
                onSeekToTime={this.seekBarDidSeekToTime}
                onDidBeginDrag={() =>
                  this.setState({ isDraggingSeekbar: true })
                }
                onDidEndDrag={() => this.setState({ isDraggingSeekbar: false })}
              />
            </View>
          </View>
        </SafeAreaView>
        <EditScreenRichTextOverlay
          isVisible={this.state.showRichTextOverlay}
          textColor={this.props.textColor}
          backgroundColor={this.props.backgroundColor}
          fontFamily={this.props.fontFamily}
          onRequestSave={(...etc) => { this.richTextEditorDidRequestSave(...etc); }}
        />
        <EditScreenLoadingOverlay isVisible={!hasFinalTranscription} />
        <EditScreenExportingOverlay isVisible={this.props.isExportingVideo} />
      </View>
    );
  }
}
