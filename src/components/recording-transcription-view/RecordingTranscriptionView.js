// @flow
import React, { Component } from 'react';
import {
  TouchableOpacity,
  requireNativeComponent,
  NativeModules,
} from 'react-native';

import type { Style } from '../../types/react';
import type { SpeechTranscription } from '../../types/speech';
import type { ColorRGBA } from '../../types/media';

type ReactNativeFiberHostComponent = any;

type Props = {
  style?: ?Style,
  duration: number,
  backgroundColor: ColorRGBA,
  textColor: ColorRGBA,
  fontFamily: string,
  fontSize: number,
  speechTranscription: ?SpeechTranscription,
  hasFinalTranscription: boolean,
  onPress?: () => void,
};

const NativeTranscriptView = requireNativeComponent('TranscriptView');
const { TranscriptViewManager } = NativeModules;

const styles = {
  container: {
    height: 85,
  },
  flex: {
    flex: 1,
  },
};

export default class RecordingTranscriptionView extends Component<Props> {
  nativeComponentRef: ?ReactNativeFiberHostComponent;

  restart() {
    if (!this.nativeComponentRef || !this.props.hasFinalTranscription) {
      return;
    }
    TranscriptViewManager.restart(this.nativeComponentRef._nativeTag);
  }

  pause() {
    if (!this.nativeComponentRef || !this.props.hasFinalTranscription) {
      return;
    }
    TranscriptViewManager.pause(this.nativeComponentRef._nativeTag);
  }

  seekToTime(time: number) {
    if (!this.nativeComponentRef || !this.props.hasFinalTranscription) {
      return;
    }
    TranscriptViewManager.seekToTime(this.nativeComponentRef._nativeTag, time);
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
        {this.props.hasFinalTranscription && (
          <NativeTranscriptView
            ref={ref => {
              this.nativeComponentRef = ref;
            }}
            style={styles.flex}
            animationParams={{
              textSegments,
              duration: this.props.duration,
              fontFamily: this.props.fontFamily,
              fontSize: this.props.fontSize,
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
          />
        )}
      </TouchableOpacity>
    );
  }
}
