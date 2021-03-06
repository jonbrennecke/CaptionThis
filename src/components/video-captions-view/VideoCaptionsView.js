// @flow
import React, { PureComponent } from 'react';
import { TouchableOpacity } from 'react-native';

import CaptionView from '../caption-view/CaptionView';

import type { SpeechTranscription } from '@jonbrennecke/react-native-speech';

import type { Style, Orientation, CaptionStyleObject } from '../../types';

type Props = {
  style?: ?Style,
  duration: number,
  orientation: Orientation,
  captionStyle: CaptionStyleObject,
  speechTranscription: ?SpeechTranscription,
  backgroundHeight: number,
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

export default class VideoCaptionsView extends PureComponent<Props> {
  captionView: ?CaptionView;

  restart() {
    if (!this.captionView) {
      return;
    }
    this.captionView.restart();
  }

  pause() {
    if (!this.captionView) {
      return;
    }
    this.captionView.pause();
  }

  seekToTime(time: number) {
    if (!this.captionView) {
      return;
    }
    this.captionView.seekToTime(time);
  }

  play() {
    if (!this.captionView) {
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
          backgroundHeight={this.props.backgroundHeight}
        />
      </TouchableOpacity>
    );
  }
}
