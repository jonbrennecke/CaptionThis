// @flow
import React, { Component } from 'react';
import { View, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import { UI_COLORS } from '../../constants';
import ScreenGradients from '../../components/screen-gradients/ScreenGradients';
import VideoPlayerView from '../../components/video-player-view/VideoPlayerView';
import RecordingTranscriptionView from '../../components/recording-transcription-view/RecordingTranscriptionView';
import VideoSeekbar from '../../components/video-seekbar/VideoSeekbar';
import EditScreenTopControls from './EditScreenTopControls';
import EditScreenFontControls from './EditScreenFontControls';
import EditScreenBackgroundColorControls from './EditScreenBackgroundColorControls';
import EditScreenFontColorControls from './EditScreenFontColorControls';
import SpeechManager from '../../utils/SpeechManager';
import VideoPlayPauseButton from '../../components/video-play-pause-button/VideoPlayPauseButton';
import {
  beginSpeechTranscriptionWithVideoAsset,
  receiveSpeechTranscriptionSuccess,
  receiveSpeechTranscriptionFailure,
} from '../../redux/media/actionCreators';
import {
  getBackgroundColor,
  getTextColor,
  getSpeechTranscriptions,
  getFontFamily,
} from '../../redux/media/selectors';

import type { VideoAssetIdentifier, ColorRGBA } from '../../types/media';
import type { Dispatch, AppState } from '../../types/redux';
import type { Return } from '../../types/util';
import type { SpeechTranscription } from '../../types/speech';

type State = {
  startTimeSeconds: number,
  durationSeconds: number,
  playbackTimeSeconds: number,
  isVideoPlaying: boolean,
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
};

type DispatchProps = {
  beginSpeechTranscriptionWithVideoAsset: VideoAssetIdentifier => Promise<void>,
  receiveSpeechTranscriptionSuccess: (
    VideoAssetIdentifier,
    SpeechTranscription
  ) => void,
  receiveSpeechTranscriptionFailure: VideoAssetIdentifier => void,
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

  onBackButtonPress() {
    Navigation.pop(this.props.componentId);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScreenGradients />
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentInsetAdjustmentBehavior="automatic"
          overScrollMode="always"
          alwaysBounceVertical
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.videoWrap}>
              <VideoPlayerView
                style={styles.videoPlayer}
                isPlaying={this.state.isVideoPlaying}
                startPosition={this.state.startTimeSeconds}
                videoAssetIdentifier={this.props.videoAssetIdentifier}
                onVideoDidBecomeReadyToPlay={
                  this.videoPlayerDidBecomeReadyToPlay
                }
                onVideoDidFailToLoad={this.videoPlayerDidFailToLoad}
                onVideoDidPause={this.videoPlayerDidPause}
                onVideoDidUpdatePlaybackTime={
                  this.videoPlayerDidUpdatePlaybackTime
                }
              />
              <EditScreenTopControls
                style={styles.editTopControls}
                onBackButtonPress={this.onBackButtonPress}
              />
              <RecordingTranscriptionView
                style={styles.transcription}
                fontFamily={this.props.fontFamily}
                speechTranscription={this.getSpeechTranscription()}
              />
            </View>
            <View style={styles.editControls}>
              <View style={styles.seekbarWrap}>
                <VideoPlayPauseButton
                  style={styles.pauseButton}
                  isPlaying={this.state.isVideoPlaying}
                  onPress={() => {
                    this.setState({
                      isVideoPlaying: !this.state.isVideoPlaying,
                    });
                  }}
                />
                <VideoSeekbar
                  style={styles.seekbar}
                  duration={this.state.durationSeconds}
                  playbackTime={this.state.playbackTimeSeconds}
                  videoAssetIdentifier={this.props.videoAssetIdentifier}
                  onSeekToTime={this.seekBarDidSeekToTime}
                />
              </View>
              <EditScreenFontControls fontFamily={this.props.fontFamily} />
              <EditScreenBackgroundColorControls
                color={this.props.backgroundColor}
              />
              <EditScreenFontColorControls color={this.props.textColor} />
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
    );
  }

  getSpeechTranscription(): ?SpeechTranscription {
    const { speechTranscriptions, videoAssetIdentifier: key } = this.props;
    if (!speechTranscriptions.has(key)) {
      return null;
    }
    return speechTranscriptions.get(key);
  }
}
