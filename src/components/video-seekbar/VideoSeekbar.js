// @flow
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { autobind } from 'core-decorators';
import isFinite from 'lodash/isFinite';
import clamp from 'lodash/clamp';

import { UI_COLORS } from '../../constants';
import DragInteractionContainer from '../drag-and-drop/DragInteractionContainer';
import VideoSeekbarPreviewView from './VideoSeekbarPreviewView';

import type { VideoAssetIdentifier } from '../../types/media';
import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  videoAssetIdentifier: VideoAssetIdentifier,
  duration: number,
  playbackTime: number,
  onSeekToTime: (time: number) => void,
  onDidBeginDrag: () => void,
  onDidEndDrag: () => void,
};

type State = {
  viewWidth: number,
};

const styles = {
  container: {
    backgroundColor: UI_COLORS.DARK_GREY,
    borderRadius: 10,
  },
  handle: {
    position: 'absolute',
    top: -3,
    bottom: -3,
    width: 15,
    left: -7.5,
    backgroundColor: UI_COLORS.WHITE,
    borderRadius: 3,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: UI_COLORS.BLACK,
    shadowRadius: 5,
  },
  dragContainer: StyleSheet.absoluteFillObject,
  preview: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
};

// $FlowFixMe
@autobind
export default class VideoSeekbar extends Component<Props, State> {
  state: State = {
    viewWidth: 0,
  };
  view: ?View;

  dragDidStart() {
    this.props.onDidBeginDrag();
  }

  dragDidEnd({ x }: { x: number, y: number }) {
    const time = this.calculatePlaybackTime(x);
    this.props.onSeekToTime(time);
    this.props.onDidEndDrag();
  }

  dragDidMove({ x }: { x: number, y: number }) {
    const time = this.calculatePlaybackTime(x);
    this.props.onSeekToTime(time);
  }

  calculatePlaybackTime(x: number): number {
    const percentOfWidth = x / this.state.viewWidth;
    const time = this.props.duration * percentOfWidth;
    return clamp(time, 0, this.props.duration);
  }

  viewDidLayout({ nativeEvent: { layout } }: any) {
    this.setState({ viewWidth: layout.width });
  }

  render() {
    const offsetX = calculateHandleOffset({
      viewWidth: this.state.viewWidth,
      playbackTime: this.props.playbackTime,
      duration: this.props.duration,
    });
    return (
      <View
        style={[styles.container, this.props.style]}
        ref={ref => {
          this.view = ref;
        }}
        onLayout={this.viewDidLayout}
      >
        <VideoSeekbarPreviewView
          style={styles.preview}
          videoAssetIdentifier={this.props.videoAssetIdentifier}
        />
        <DragInteractionContainer
          style={styles.dragContainer}
          vertical={false}
          returnToOriginalPosition={false}
          onDragStart={this.dragDidStart}
          onDragEnd={this.dragDidEnd}
          onDragMove={this.dragDidMove}
          additionalOffset={{
            x: offsetX,
            y: 0,
          }}
          renderChildren={props => <View style={styles.handle} {...props} />}
        />
      </View>
    );
  }
}

function calculateHandleOffset({
  viewWidth,
  playbackTime,
  duration,
}: {
  viewWidth: number,
  playbackTime: number,
  duration: number,
}): number {
  const offset = viewWidth * (playbackTime / duration);
  if (!isFinite(offset)) {
    return 0;
  }
  return clamp(offset, 0, viewWidth);
}
