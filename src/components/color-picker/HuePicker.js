// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { autobind } from 'core-decorators';

import HueGradientView from './HueGradientView';
import DragInteractionContainer from '../drag-and-drop/DragInteractionContainer';
import { UI_COLORS } from '../../constants';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
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
    position: 'absolute',
    top: -5,
    bottom: -5,
    width: 7,
    borderRadius: 3,
    backgroundColor: UI_COLORS.OFF_WHITE,
    shadowOpacity: 0.35,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: UI_COLORS.BLACK,
    shadowRadius: 10,
  },
};

// $FlowFixMe
@autobind
export default class HuePicker extends Component<Props> {
  dragDidStart() {}

  dragDidEnd() {}

  dragDidMove(e: Event, { moveX }: Gesture) {}

  render() {
    return (
      <View style={this.props.style}>
        <HueGradientView style={styles.gradientView} />
        <DragInteractionContainer
          style={styles.draggable}
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
