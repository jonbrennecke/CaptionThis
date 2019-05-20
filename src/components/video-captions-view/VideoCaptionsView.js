// @flow
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';

import CaptionView from '../caption-view/CaptionView';

import type { Style } from '../../types/react';
import type { SpeechTranscription } from '../../types/speech';
import type { Orientation } from '../../types/media';
import type { CaptionStyleObject, CaptionViewLayout } from '../../types/video';

type Props = {
  style?: ?Style,
  duration: number,
  orientation: Orientation,
  captionStyle: CaptionStyleObject,
  viewLayout: CaptionViewLayout,
  speechTranscription: ?SpeechTranscription,
  isReadyToPlay: boolean,
  onPress?: () => void,
};

const styles = {
  container: {
    height: 85,
  },
  flex: {
    flex: 1,
  },
};

export default class VideoCaptionsView extends Component<Props> {
  captionView: ?CaptionView;

  restart() {
    if (!this.captionView || !this.props.isReadyToPlay) {
      return;
    }
    this.captionView.restart();
  }

  pause() {
    if (!this.captionView || !this.props.isReadyToPlay) {
      return;
    }
    this.captionView.pause();
  }

  seekToTime(time: number) {
    if (!this.captionView || !this.props.isReadyToPlay) {
      return;
    }
    this.captionView.seekToTime(time);
  }

  play() {
    if (!this.captionView || !this.props.isReadyToPlay) {
      return;
    }
    this.captionView.play();
  }

  render() {
    const textSegments = this.props.speechTranscription
      ? this.props.speechTranscription.segments.map(segment => ({
          duration: segment.duration,
          timestamp: segment.timestamp,
          text: segment.substring,
        }))
      : [];
    return (
      <TouchableOpacity
        disabled={!this.props.onPress}
        style={[styles.container, this.props.style]}
        onPress={this.props.onPress}
      >
        <CaptionView
          ref={ref => {
            this.captionView = ref;
          }}
          style={styles.flex}
          duration={this.props.duration}
          textSegments={textSegments}
          captionStyle={this.props.captionStyle}
          viewLayout={this.props.viewLayout}
        />
      </TouchableOpacity>
    );
  }
}
