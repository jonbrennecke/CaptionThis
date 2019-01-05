// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { autobind } from 'core-decorators';

import SaturationAndBrightnessGradientView from './SaturationAndBrightnessGradientView';
import DragInteractionContainer from '../drag-and-drop/DragInteractionContainer';
import { UI_COLORS } from '../../constants';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';

type Props = {
  style?: ?Style,
  color: ColorRGBA,
  onDidUpdateColor: ColorRGBA => void,
  onDidStartDrag?: () => void,
  onDidEndDrag?: () => void,
};

type State = {
  offset: {
    x: number,
    y: number,
  },
};

const styles = {
  gradientView: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  draggable: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  seekPositionHandle: {
    height: 15,
    width: 15,
    borderRadius: 7.5,
    backgroundColor: UI_COLORS.OFF_WHITE,
    shadowOpacity: 0.35,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: UI_COLORS.BLACK,
    shadowRadius: 15,
  },
};

// $FlowFixMe
@autobind
export default class SaturationAndBrightnessPicker extends Component<
  Props,
  State
> {
  state = {
    offset: {
      x: 0,
      y: 0,
    },
  };

  dragDidStart() {
    if (!this.props.onDidStartDrag) {
      return;
    }
    this.props.onDidStartDrag();
  }

  dragDidEnd() {
    if (!this.props.onDidEndDrag) {
      return;
    }
    this.props.onDidEndDrag();
  }

  dragDidMove(offset: { x: number, y: number }) {
    this.setState({
      offset,
    });
  }

  render() {
    return (
      <View style={this.props.style}>
        <SaturationAndBrightnessGradientView
          style={styles.gradientView}
          color={this.props.color}
          offset={this.state.offset}
          onDidUpdateColor={this.props.onDidUpdateColor}
        />
        <DragInteractionContainer
          style={styles.draggable}
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
