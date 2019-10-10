// @flow
import React, { PureComponent } from 'react';
import { View, SafeAreaView, Dimensions, StyleSheet } from 'react-native';
import throttle from 'lodash/throttle';
import { autobind } from 'core-decorators';
import { VideoPlayer } from '@jonbrennecke/react-native-media';

import { UI_COLORS } from '../../constants';
import * as Debug from '../../utils/Debug';
import { isLandscape, isPortrait } from '../../utils/Orientation';
import VideoCaptionsContainer from '../../components/video-captions-view/VideoCaptionsContainer';
import EditScreenTopControls from './EditScreenTopControls';
import VideoCaptionsView from '../../components/video-captions-view/VideoCaptionsView';
import ScaleAnimatedView from '../../components/animations/ScaleAnimatedView';
import { MeasureContentsView, PlaybackSeekbar } from '../../components';

import type {
  MediaObject,
  PlaybackState,
} from '@jonbrennecke/react-native-media';

import type { Size, Orientation } from '../../types/media';
import type { SpeechTranscription } from '../../types/speech';
import type { CaptionStyleObject } from '../../types/video';

type Props = {
  videoPlayerViewSize: Size,
  video: MediaObject,
  countryCode: ?string,
  isAppInForeground: boolean,
  isDeviceLimitedByMemory: boolean,
  isCaptionsEditorVisible: boolean,
  isSpeechTranscriptionFinal: boolean,
  isExportingVideo: boolean,
  captionStyle: CaptionStyleObject,
  speechTranscription: ?SpeechTranscription,
  orientation: Orientation,
  onRequestChangePlaybackTime: number => void,
  onRequestChangeOrientation: Orientation => void,
  onRequestShowRichTextEditor: () => void,
  onRequestShowCaptionsEditor: () => void,
  onRequestPopToHomeScreen: () => void,
  onRequestExport: () => void,
  onDidPauseCaptions: () => void,
  onDidRestartCaptions: () => void,
  onLocaleButtonPress: () => void,
  onVideoViewDidUpdateSize: Size => void,
};

type State = {
  playbackTime: number,
  playbackState: PlaybackState,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = {
  flex: {
    flex: 1,
  },
  absoluteFill: StyleSheet.absoluteFillObject,
  videoWrap: {
    borderRadius: 10,
    flex: 1,
    flexGrow: 1,
    overflow: 'hidden',
    backgroundColor: UI_COLORS.DARK_GREY,
  },
  measuredContents: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  captionPaddingView: {
    height: 75,
  },
  playbackControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  editControls: {
    height: 70,
    width: SCREEN_WIDTH,
    paddingTop: 10,
    // TODO: The bottom padding is only necessary because of the seekbar handle being cut off in phones without a notch (i.e. iPhones older than the X series)
    paddingBottom: 3,
  },
  editTopControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  seekbarWrap: {
    flexDirection: 'row',
  },
};

// $FlowFixMe
@autobind
export default class EditScreenVideoPlayer extends PureComponent<Props, State> {
  captionsView: ?VideoCaptionsView;
  playerView: ?VideoPlayer;
  state = {
    playbackTime: 0,
    playbackState: 'waiting',
  };

  componentDidUpdate(prevProps: Props) {
    if (this.props.isAppInForeground && !prevProps.isAppInForeground) {
      this.appWillEnterForeground();
    } else if (!this.props.isAppInForeground && prevProps.isAppInForeground) {
      this.appWillEnterBackground();
    }
    if (
      this.props.isCaptionsEditorVisible &&
      !prevProps.isCaptionsEditorVisible
    ) {
      this.onDidPresentCaptionsEditor();
    } else if (
      !this.props.isCaptionsEditorVisible &&
      prevProps.isCaptionsEditorVisible
    ) {
      this.onDidDismissCaptionsEditor();
    }
    if (this.props.isExportingVideo && !prevProps.isExportingVideo) {
      this.onDidBeginExport();
    } else if (!this.props.isExportingVideo && prevProps.isExportingVideo) {
      this.onDidEndExport();
    }
  }

  appWillEnterBackground() {
    this.pausePlayerAndCaptions();
  }

  appWillEnterForeground() {
    this.restartPlayerAndCaptions();
  }

  onDidPresentCaptionsEditor() {
    this.pausePlayerAndCaptions();
  }

  onDidDismissCaptionsEditor() {
    this.restartPlayerAndCaptions();
  }

  onDidBeginExport() {
    this.pausePlayerAndCaptions();
  }

  onDidEndExport() {
    this.restartPlayerAndCaptions();
  }

  seekBarDidSeekToTimeThrottled = throttle(this.seekBarDidSeekToTime, 50, {
    leading: true,
  });

  seekBarDidSeekToTime(time: number) {
    this.seekToTime(time);
    this.onRequestChangePlaybackTimeThrottled(time);
  }

  async seekToTime(time: number) {
    if (this.playerView) {
      await this.playerView.seekToTime(time);
    }
    if (this.captionsView) {
      this.captionsView.seekToTime(time);
    }
  }

  onRequestChangePlaybackTimeThrottled = throttle(
    this.props.onRequestChangePlaybackTime,
    50,
    {
      leading: true,
    }
  );

  videoPlayerDidFailToLoad() {
    Debug.log('Video player failed to load');
    this.pausePlayerAndCaptions();
  }

  videoPlayerDidPause() {
    Debug.log('Video player paused');
    this.pauseCaptions();
  }

  videoPlayerDidUpdatePlaybackTimeThrottled = throttle(
    this.videoPlayerDidUpdatePlaybackTime,
    50,
    {
      leading: true,
    }
  );

  videoPlayerDidUpdatePlaybackTime(playbackTime: number) {
    this.setState({ playbackTime });
    this.props.onRequestChangePlaybackTime(playbackTime);
  }

  videoPlayerDidRestart() {
    this.restartCaptions();
  }

  restartPlayerAndCaptions() {
    this.restartCaptions();
    this.restartPlayer();
  }

  startPlayerAndCaptions() {
    this.startCaptions();
    this.startPlayer();
  }

  restartCaptions() {
    if (this.captionsView) {
      this.captionsView.restart();
    }
    this.props.onDidRestartCaptions();
  }

  restartPlayer() {
    if (!this.playerView) {
      return;
    }
    this.playerView.restart();
  }

  pausePlayerAndCaptions() {
    this.pausePlayer();
    this.pauseCaptions();
  }

  startPlayer() {
    if (!this.playerView) {
      return;
    }
    this.playerView.play();
    Debug.log('Player started.');
  }

  startCaptions() {
    if (this.captionsView) {
      this.captionsView.play();
    }
    Debug.log('Captions started.');
  }

  pausePlayer() {
    if (!this.playerView) {
      return;
    }
    this.playerView.pause();
    Debug.log('Player paused.');
  }

  pauseCaptions() {
    if (this.captionsView) {
      this.captionsView.pause();
    }
    this.props.onDidPauseCaptions();
    Debug.log('Captions paused.');
  }

  render() {
    const captionViewLayout = ({ height, width }) => ({
      size: isLandscape(this.props.orientation)
        ? { width, height: height }
        : { width, height: height + 85 },
      origin: { x: 0, y: 0 },
    });
    const captionStyleForOrientation = (
      orientation: Orientation,
      { fontSize, ...captionStyle }: CaptionStyleObject
    ) => ({
      ...captionStyle,
      fontSize: isLandscape(orientation) ? fontSize * 0.5 : fontSize,
    });
    return (
      <SafeAreaView style={styles.flex}>
        {this.props.isSpeechTranscriptionFinal && (
          <ScaleAnimatedView
            style={styles.videoWrap}
            isVisible={this.state.playbackState !== 'waiting'}
          >
            <VideoPlayer
              ref={ref => {
                this.playerView = ref;
              }}
              style={styles.absoluteFill}
              videoID={this.props.video.assetID}
              onVideoDidFailToLoad={this.videoPlayerDidFailToLoad}
              onVideoDidUpdatePlaybackTime={
                this.videoPlayerDidUpdatePlaybackTimeThrottled
              }
              onVideoDidRestart={this.videoPlayerDidRestart}
              onViewDidResize={this.props.onVideoViewDidUpdateSize}
              onPlaybackStateChange={playbackState => {
                this.setState({
                  playbackState,
                });
                if (playbackState === 'readyToPlay') {
                  this.startPlayerAndCaptions();
                }
              }}
            />
            <MeasureContentsView
              style={styles.measuredContents}
              renderChildren={viewSize => (
                <>
                  <VideoCaptionsContainer
                    videoPlayerViewSize={this.props.videoPlayerViewSize}
                    orientation={this.props.orientation}
                  >
                    <VideoCaptionsView
                      ref={ref => {
                        this.captionsView = ref;
                      }}
                      style={styles.flex}
                      orientation={this.props.orientation}
                      duration={this.props.video.duration}
                      captionStyle={captionStyleForOrientation(
                        this.props.orientation,
                        this.props.captionStyle
                      )}
                      viewLayout={captionViewLayout(viewSize)}
                      speechTranscription={this.props.speechTranscription}
                      onPress={this.props.onRequestShowRichTextEditor}
                    />
                  </VideoCaptionsContainer>
                  {isPortrait(this.props.orientation) && (
                    <View style={styles.captionPaddingView} />
                  )}
                </>
              )}
            />
            <EditScreenTopControls
              style={styles.editTopControls}
              countryCode={this.props.countryCode}
              isReadyToExport={this.props.isSpeechTranscriptionFinal}
              onBackButtonPress={this.props.onRequestPopToHomeScreen}
              onExportButtonPress={this.props.onRequestExport}
              onStylizeButtonPress={this.props.onRequestShowRichTextEditor}
              onEditTextButtonPress={this.props.onRequestShowCaptionsEditor}
              onLocaleButtonPress={this.props.onLocaleButtonPress}
            />
          </ScaleAnimatedView>
        )}
        <ScaleAnimatedView
          isVisible={this.state.playbackState !== 'waiting'}
          style={styles.editControls}
        >
          <PlaybackSeekbar
            style={styles.flex}
            assetID={this.props.video.assetID}
            playbackProgress={
              this.state.playbackTime / this.props.video.duration
            }
            playbackState={this.state.playbackState}
            onSeekToProgress={progress =>
              this.seekBarDidSeekToTimeThrottled(
                this.props.video.duration * progress
              )
            }
            onRequestPause={this.pausePlayerAndCaptions}
            onRequestPlay={this.startPlayerAndCaptions}
          />
        </ScaleAnimatedView>
      </SafeAreaView>
    );
  }
}
