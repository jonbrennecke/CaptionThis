// @flow
import React, { Component } from 'react';
import { View, SafeAreaView, Dimensions } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { UI_COLORS } from '../../constants';
import ScreenGradients from '../../components/screen-gradients/ScreenGradients';
import VideoPlayerView from '../../components/video-player-view/VideoPlayerView';
import { beginSpeechTranscriptionWithVideoAsset } from '../../redux/media/actionCreators';

import type { VideoAssetIdentifier } from '../../types/media';
import type { Dispatch } from '../../types/redux';

type OwnProps = {
  videoAssetIdentifier: VideoAssetIdentifier,
};

type StateProps = {};

type DispatchProps = {
  beginSpeechTranscriptionWithVideoAsset: (
    videoAssetIdentifier: VideoAssetIdentifier
  ) => Promise<void>,
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
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
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
};

function mapStateToProps(): StateProps {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    beginSpeechTranscriptionWithVideoAsset: (id: VideoAssetIdentifier) =>
      dispatch(beginSpeechTranscriptionWithVideoAsset(id)),
  };
}

// $FlowFixMe
@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class EditScreen extends Component<Props> {
  videoDidFailToLoad() {}

  async videoDidBecomeReadyToPlay() {
    await this.props.beginSpeechTranscriptionWithVideoAsset(
      this.props.videoAssetIdentifier
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ScreenGradients />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.videoWrap}>
            <VideoPlayerView
              style={styles.videoPlayer}
              videoAssetIdentifier={this.props.videoAssetIdentifier}
              onVideoDidBecomeReadyToPlay={() => {
                this.videoDidBecomeReadyToPlay();
              }}
              onVideoDidFailToLoad={() => {
                this.videoDidFailToLoad();
              }}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
