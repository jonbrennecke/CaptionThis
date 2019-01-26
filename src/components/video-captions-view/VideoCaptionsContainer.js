// @flow
import React, { Component } from 'react';
import { View } from 'react-native';

import { isLandscape } from '../../utils/Orientation';

import type { Style, Children } from '../../types/react';
import type { ImageOrientation } from '../../types/media';

type Props = {
  style?: ?Style,
  children?: ?Children,
  orientation: ?ImageOrientation,
};

type Size = {
  height: number,
  width: number,
};

type State = {
  viewSize: Size,
};

const styles = {
  container: {},
  captionsWrap: (orientation: ImageOrientation, size: Size) =>
    isLandscape(orientation)
      ? {
          position: 'absolute',
          left: 0,
          right: 0,
        }
      : {
          position: 'absolute',
          left: 0,
          right: 0,
          height: 85,
          bottom: 50,
        },
};

export default class VideoCaptionsContainer extends Component<Props, State> {
  view: ?View;
  state = {
    viewSize: {
      height: 0,
      width: 0,
    },
  };

  viewDidLayout() {
    if (!this.view) {
      return;
    }
    this.view.measure((fx, fy, width, height) => {
      this.setState({
        viewSize: {
          width,
          height,
        },
      });
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
        <View
          style={styles.captionsWrap(
            this.props.orientation || 'up',
            this.state.viewSize
          )}
        >
          {this.props.children}
        </View>
      </View>
    );
  }
}
