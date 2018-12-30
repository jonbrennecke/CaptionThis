// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { autobind } from 'core-decorators';

import SaturationAndBrightnessGradientView from './SaturationAndBrightnessGradientView';
import DragInteractionContainer from '../drag-and-drop/DragInteractionContainer';
import { UI_COLORS } from '../../constants';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
};

const styles = {
  flex: {
    flex: 1,
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
export default class SaturationAndBrightnessPicker extends Component<Props> {
  dragDidStart() {}

  dragDidEnd() {}

  dragDidMove(e: Event, { moveX }: Gesture) {}

  render() {
    return (
      <View style={this.props.style}>
        <SaturationAndBrightnessGradientView style={styles.flex} />
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
