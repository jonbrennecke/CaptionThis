// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { autobind } from 'core-decorators';

import HueGradientView from './HueGradientView';
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
  position: {
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
  handle: {
    position: 'absolute',
    left: -5,
    right: -5,
    height: 15,
    top: -7.5,
    borderRadius: 7.5,
    borderWidth: 2,
    borderColor: UI_COLORS.DARK_GREY,
    backgroundColor: UI_COLORS.OFF_WHITE,
    shadowOpacity: 0.5,
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
export default class HuePicker extends Component<Props, State> {
  state = {
    position: {
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

  dragDidMove({ y }: { x: number, y: number }) {
    this.setState({
      position: { y },
    });
  }

  render() {
    return (
      <View style={this.props.style}>
        <HueGradientView
          style={styles.gradientView}
          color={this.props.color}
          offset={this.state.position}
          onDidUpdateColor={this.props.onDidUpdateColor}
        />
        <DragInteractionContainer
          style={styles.draggable}
          horizontal={false}
          itemsShouldReturnToOriginalPosition={false}
          onDragStart={this.dragDidStart}
          onDragEnd={this.dragDidEnd}
          onDragMove={this.dragDidMove}
          renderChildren={props => <View style={styles.handle} {...props} />}
        />
      </View>
    );
  }
}
