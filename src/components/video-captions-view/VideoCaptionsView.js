// @flow
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';

import CaptionView from '../caption-view/CaptionView';

import type { Style } from '../../types/react';
import type { SpeechTranscription } from '../../types/speech';
import type { Orientation } from '../../types/media';
import type { CaptionStyleObject } from '../../types/video';

type ReactNativeFiberHostComponent = any;

type Props = {
  style?: ?Style,
  duration: number,
  orientation: Orientation,
  captionStyle: CaptionStyleObject,
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
  nativeComponentRef: ?ReactNativeFiberHostComponent;

  restart() {
    if (!this.nativeComponentRef || !this.props.isReadyToPlay) {
      return;
    }
    // TODO: TranscriptViewManager.restart(this.nativeComponentRef._nativeTag);
  }

  pause() {
    if (!this.nativeComponentRef || !this.props.isReadyToPlay) {
      return;
    }
    // TODO: TranscriptViewManager.pause(this.nativeComponentRef._nativeTag);
  }

  seekToTime(time: number) {
    if (!this.nativeComponentRef || !this.props.isReadyToPlay) {
      return;
    }
    // TODO: TranscriptViewManager.seekToTime(this.nativeComponentRef._nativeTag, time);
  }

  play() {
    if (!this.nativeComponentRef || !this.props.isReadyToPlay) {
      return;
    }
    // TODO: TranscriptViewManager.play(this.nativeComponentRef._nativeTag);
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
        {/* ref={ref => {
            this.nativeComponentRef = ref;
          }} */}
        <CaptionView
          style={styles.flex}
          duration={this.props.duration}
          textSegments={textSegments}
          captionStyle={this.props.captionStyle}
        />
      </TouchableOpacity>
    );
  }
}
