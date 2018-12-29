// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { autobind } from 'core-decorators';

import { UI_COLORS } from '../../constants';
import DragInteractionContainer from '../drag-and-drop/DragInteractionContainer';

type Props = {};

const styles = {
  container: {
    backgroundColor: UI_COLORS.DARK_GREY,
    flex: 1,
    height: 20,
    borderRadius: 10,
  },
  seekPositionHandle: {
    position: 'absolute',
    top: -5,
    bottom: -5,
    width: 7,
    backgroundColor: UI_COLORS.LIGHT_GREY,
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
};

// $FlowFixMe
@autobind
export default class VideoSeekbar extends Component<Props> {
  dragDidStart() {}

  dragDidEnd() {}

  dragDidMove() {}

  render() {
    return (
      <View style={styles.container}>
        <DragInteractionContainer
          style={styles.dragContainer}
          vertical={false}
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
