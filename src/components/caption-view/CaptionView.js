// @flow
import React, { PureComponent } from 'react';
import { View, requireNativeComponent, NativeModules } from 'react-native';
import { promisifyAll } from 'bluebird';

import * as Color from '../../utils/Color';

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
    const { captionStyle, backgroundHeight } = this.props;
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
            backgroundHeight
          )}
        />
      </View>
    );
  }
}

function makeCaptionStyleForNativeBridge(
  captionStyle: CaptionStyleObject,
  backgroundHeight: number
) {
  return {
    wordStyle: captionStyle.wordStyle,
    backgroundStyle: {
      styleType: captionStyle.backgroundStyle,
      backgroundColor: Color.transformRgbaObjectForNativeBridge(
        captionStyle.backgroundColor
      ),
      backgroundHeight,
    },
    lineStyle: {
      styleType: captionStyle.lineStyle,
      fadeInOutProperties: {
        numberOfLines: 2,
        padding: {
          vertical: 1.3,
        },
      },
    },
    textStyle: {
      font: {
        fontFamily: captionStyle.fontFamily,
        pointSize: captionStyle.fontSize,
      },
      color: Color.transformRgbaObjectForNativeBridge(captionStyle.textColor),
      shadow: {
        opacity: 0.5,
        color: Color.transformRgbaObjectForNativeBridge({
          red: 0,
          green: 0,
          blue: 0,
          alpha: 0,
        }),
      },
      alignment: captionStyle.textAlignment,
    },
  };
}
