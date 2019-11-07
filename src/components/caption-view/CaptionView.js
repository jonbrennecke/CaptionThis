// @flow
import React, { PureComponent } from 'react';
import { View, requireNativeComponent, NativeModules } from 'react-native';
import { promisifyAll } from 'bluebird';

import { makeCaptionStyleForNativeBridge } from '../../utils';

import type { Style } from '../../types/react';
import type { CaptionStyleObject } from '../../types/video';
import type { TextSegmentObject } from '../../types/media';

type ReactNativeFiberHostComponent = any;

const NativeCaptionView = requireNativeComponent('HSCaptionView');
const { HSCaptionViewManager: HSCaptionViewManager } = NativeModules;

const CaptionViewManager = promisifyAll(HSCaptionViewManager);

export type CaptionViewProps = {
  style?: ?Style,
  duration: number,
  backgroundHeight: number,
  lineStyleVerticalPadding?: number,
  textSegments: TextSegmentObject[],
  captionStyle: CaptionStyleObject,
};

const styles = {
  container: {},
  nativeView: {
    flex: 1,
  },
};

export default class CaptionView extends PureComponent<CaptionViewProps> {
  nativeComponentRef: ?ReactNativeFiberHostComponent;

  restart() {
    if (!this.nativeComponentRef) {
      return;
    }
    CaptionViewManager.restart(this.nativeComponentRef._nativeTag);
  }

  pause() {
    if (!this.nativeComponentRef) {
      return;
    }
    CaptionViewManager.pause(this.nativeComponentRef._nativeTag);
  }

  seekToTime(time: number) {
    if (!this.nativeComponentRef) {
      return;
    }
    CaptionViewManager.seekToTime(this.nativeComponentRef._nativeTag, time);
  }

  play() {
    if (!this.nativeComponentRef) {
      return;
    }
    CaptionViewManager.play(this.nativeComponentRef._nativeTag);
  }

  render() {
    const { captionStyle, backgroundHeight, lineStyleVerticalPadding } = this.props;
    return (
      <View style={[styles.container, this.props.style]}>
        <NativeCaptionView
          ref={ref => {
            this.nativeComponentRef = ref;
          }}
          style={styles.nativeView}
          duration={this.props.duration}
          textSegments={this.props.textSegments}
          captionStyle={makeCaptionStyleForNativeBridge(
            captionStyle,
            backgroundHeight,
            lineStyleVerticalPadding
          )}
        />
      </View>
    );
  }
}
