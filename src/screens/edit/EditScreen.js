// @flow
import React, { Component } from 'react';
import { View, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import { UI_COLORS } from '../../constants';
import ScreenGradients from '../../components/screen-gradients/ScreenGradients';
import VideoPlayerView from '../../components/video-player-view/VideoPlayerView';
import TranscriptionView from '../../components/transcription-view/TranscriptionView';
import VideoSeekbar from '../../components/video-seekbar/VideoSeekbar';
import EditScreenTopControls from './EditScreenTopControls';
import EditScreenFontControls from './EditScreenFontControls';
import SpeechManager from '../../utils/SpeechManager';
import {
  beginSpeechTranscriptionWithVideoAsset,
  receiveSpeechTranscriptionSuccess,
  receiveSpeechTranscriptionFailure,
} from '../../redux/media/actionCreators';
import {
  getSpeechTranscriptions,
  getFontFamily,
} from '../../redux/media/selectors';

import type { VideoAssetIdentifier } from '../../types/media';
import type { Dispatch, AppState } from '../../types/redux';
import type { Return } from '../../types/util';
import type { SpeechTranscription } from '../../types/speech';

type VideoDidBecomeReadyToPlayParams = {
  duration: number,
};

type State = {
  durationSeconds: number,
  startPositionSeconds: number,
};

type OwnProps = {
  componentId: string,
  videoAssetIdentifier: VideoAssetIdentifier,
};

type StateProps = {
  speechTranscriptions: Map<VideoAssetIdentifier, SpeechTranscription>,
  fontFamily: string,
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
};

function mapStateToProps(appState: AppState): StateProps {
  return {
    speechTranscriptions: getSpeechTranscriptions(appState),
    fontFamily: getFontFamily(appState),
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
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
    durationSeconds: 0,
    startPositionSeconds: 0,
  };

  // eslint-disable-next-line flowtype/generic-spacing
  speechTranscriptionSubscription: ?Return<
    typeof SpeechManager.addSpeechTranscriptionListener
  >;

  componentDidMount() {
    SpeechManager.addSpeechTranscriptionListener(
      this.speechManagerDidReceiveSpeechTranscription
    );
  }

  componentWillUnmount() {
    if (this.speechTranscriptionSubscription) {
      SpeechManager.removeListener(this.speechTranscriptionSubscription);
    }
  }

  videoDidFailToLoad() {
    // TODO: display error message
  }

  async videoDidBecomeReadyToPlay({
    duration,
  }: VideoDidBecomeReadyToPlayParams) {
    this.setState({ durationSeconds: duration });
    await this.props.beginSpeechTranscriptionWithVideoAsset(
      this.props.videoAssetIdentifier
    );
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

  seekBarDidSeekToPercent(percent: number) {
    this.setState({
      startPositionSeconds: this.state.durationSeconds * percent,
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
                startPosition={this.state.startPositionSeconds}
                videoAssetIdentifier={this.props.videoAssetIdentifier}
                onVideoDidBecomeReadyToPlay={(
                  params: VideoDidBecomeReadyToPlayParams
                ) => {
                  this.videoDidBecomeReadyToPlay(params);
                }}
                onVideoDidFailToLoad={() => {
                  this.videoDidFailToLoad();
                }}
              />
              <EditScreenTopControls
                style={styles.editTopControls}
                onBackButtonPress={this.onBackButtonPress}
              />
              <TranscriptionView
                style={styles.transcription}
                text={this.getSpeechTranscriptionDisplayText()}
              />
            </View>
            <View style={styles.editControls}>
              <VideoSeekbar
                videoAssetIdentifier={this.props.videoAssetIdentifier}
                onSeekToPercent={this.seekBarDidSeekToPercent}
              />
            </View>
            <EditScreenFontControls fontFamily={this.props.fontFamily} />
          </SafeAreaView>
        </ScrollView>
      </View>
    );
  }

  getSpeechTranscriptionDisplayText() {
    const { speechTranscriptions, videoAssetIdentifier: key } = this.props;
    if (!speechTranscriptions.has(key)) {
      return '';
    }
    return speechTranscriptions.get(key)?.formattedString || '';
  }
}
