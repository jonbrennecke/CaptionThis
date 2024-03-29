// @flow
import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
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
  draggable: StyleSheet.absoluteFillObject,
  handle: {
    position: 'absolute',
    height: 35,
    width: 35,
    left: -17.5,
    top: -17.5,
    borderRadius: 17.5,
    borderWidth: 2,
    borderColor: UI_COLORS.DARK_GREY,
    backgroundColor: UI_COLORS.OFF_WHITE,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: UI_COLORS.BLACK,
    shadowRadius: 14,
  },
};

// $FlowFixMe
@autobind
export default class SaturationAndBrightnessPicker extends PureComponent<
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
          returnToOriginalPosition={false}
          onDragStart={this.dragDidStart}
          onDragEnd={this.dragDidEnd}
          onDragMove={this.dragDidMove}
          renderChildren={props => <View style={styles.handle} {...props} />}
        />
      </View>
    );
  }
}
