// @flow
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';

import CaptionView from '../caption-view/CaptionView';

import type { Style } from '../../types/react';
import type { SpeechTranscription } from '../../types/speech';
import type { ColorRGBA, Orientation } from '../../types/media';

type ReactNativeFiberHostComponent = any;

type Props = {
  style?: ?Style,
  duration: number,
  orientation: Orientation,
  backgroundColor: ColorRGBA,
  textColor: ColorRGBA,
  fontFamily: string,
  fontSize: number,
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
        {/* <NativeTranscriptView
          ref={ref => {
            this.nativeComponentRef = ref;
          }}
          style={styles.flex}
          isReadyToPlay={this.props.isReadyToPlay}
          animationParams={{
            textSegments,
            orientation: this.props.orientation,
            duration: this.props.duration,
            fontFamily: this.props.fontFamily,
            fontSize: this.props.fontSize,
            lineStyle: this.props.lineStyle,
            textColor: [
              this.props.textColor.red / 255,
              this.props.textColor.green / 255,
              this.props.textColor.blue / 255,
              this.props.textColor.alpha,
            ],
            backgroundColor: [
              this.props.backgroundColor.red / 255,
              this.props.backgroundColor.green / 255,
              this.props.backgroundColor.blue / 255,
              this.props.backgroundColor.alpha,
            ],
          }}
        /> */}
        <CaptionView
          style={styles.flex}
          duration={this.props.duration}
          textSegments={textSegments}
          captionStyle={{
            textAlignment: 'left',
            lineStyle: 'translateY',
            wordStyle: 'none',
            backgroundStyle: 'gradient',
            backgroundColor: this.props.backgroundColor,
            fontSize: this.props.fontSize,
            fontFamily: this.props.fontFamily,
          }}
        />
      </TouchableOpacity>
    );
  }
}
