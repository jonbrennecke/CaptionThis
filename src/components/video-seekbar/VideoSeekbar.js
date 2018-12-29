// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { autobind } from 'core-decorators';

import { UI_COLORS } from '../../constants';
import DragInteractionContainer from '../drag-and-drop/DragInteractionContainer';
import VideoSeekbarPreviewView from './VideoSeekbarPreviewView';

import type { VideoAssetIdentifier } from '../../types/media';
import type { Style, Gesture } from '../../types/react';

type Props = {
  style?: ?Style,
  videoAssetIdentifier: VideoAssetIdentifier,
  onSeekToPercent: (percent: number) => void,
};

type State = {
  viewWidth: number,
};

const styles = {
  container: {
    backgroundColor: UI_COLORS.DARK_GREY,
    height: 45,
    borderRadius: 10,
  },
  seekPositionHandle: {
    position: 'absolute',
    top: -5,
    bottom: -5,
    width: 7,
    backgroundColor: UI_COLORS.OFF_WHITE,
    borderRadius: 3,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: UI_COLORS.BLACK,
    shadowRadius: 5,
  },
  dragContainer: {
    flex: 1,
  },
  preview: {
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

  dragDidStart() {}

  dragDidEnd() {}

  dragDidMove(e: Event, { moveX }: Gesture) {
    if (!this.state.viewWidth) {
      return;
    }
    const percentOfWidth = moveX / this.state.viewWidth;
    this.props.onSeekToPercent(percentOfWidth);
  }

  viewDidLayout() {
    if (!this.view) {
      return;
    }
    this.view.measure((fx, fy, width) => {
      this.setState({ viewWidth: width });
    });
  }

  render() {
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
          itemsShouldReturnToOriginalPosition={false}
          onDragStart={this.dragDidStart}
          onDragEnd={this.dragDidEnd}
          onDragMove={this.dragDidMove}
        >
          <View style={styles.seekPositionHandle} />
        </DragInteractionContainer>
      </View>
    );
  }
}
