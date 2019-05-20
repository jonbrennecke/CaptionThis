// @flow
import React, { Component } from 'react';
import { View, requireNativeComponent, NativeModules } from 'react-native';

import * as Color from '../../utils/Color';

import type { Style } from '../../types/react';
import type { CaptionStyleObject, CaptionViewLayout } from '../../types/video';
import type { TextSegmentObject } from '../../types/media';

type ReactNativeFiberHostComponent = any;

const NativeCaptionView = requireNativeComponent('CaptionView');
const { CaptionViewManager } = NativeModules;

type Props = {
  style?: ?Style,
  duration: number,
  textSegments: TextSegmentObject[],
  captionStyle: CaptionStyleObject,
  viewLayout?: CaptionViewLayout,
};

const styles = {
  container: {},
  nativeView: {
    flex: 1,
  },
};

export default class CaptionView extends Component<Props> {
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
    return (
      <View style={[styles.container, this.props.style]}>
        <NativeCaptionView
          ref={ref => {
            this.nativeComponentRef = ref;
          }}
          style={styles.nativeView}
          duration={this.props.duration}
          textSegments={this.props.textSegments}
          textAlignment={this.props.captionStyle.textAlignment}
          lineStyle={this.props.captionStyle.lineStyle}
          wordStyle={this.props.captionStyle.wordStyle}
          backgroundStyle={this.props.captionStyle.backgroundStyle}
          fontSize={this.props.captionStyle.fontSize}
          fontFamily={this.props.captionStyle.fontFamily}
          backgroundColor={Color.transformRgbaObjectForNativeBridge(
            this.props.captionStyle.backgroundColor
          )}
          textColor={Color.transformRgbaObjectForNativeBridge(
            this.props.captionStyle.textColor
          )}
          viewLayout={this.props.viewLayout}
        />
      </View>
    );
  }
}
