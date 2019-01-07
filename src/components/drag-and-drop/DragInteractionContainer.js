// @flow
import React, { Component } from 'react';
import { PanResponder, Animated, View } from 'react-native';
import { autobind } from 'core-decorators';
import isNil from 'lodash/isNil';
import extend from 'lodash/extend';

import type { Gesture, Style } from '../../types/react';
import type { Element } from 'react';

type Props = {
  itemsShouldReturnToOriginalPosition?: boolean,
  canDrag?: boolean,
  vertical?: boolean,
  horizontal?: boolean,
  applyTransformStyles?: boolean,
  style?: Style,
  renderChildren: (props: {}) => Element<*>,
  onDragStart: (event: Event, gesture: Gesture) => void,
  onDragEnd: (event: Event, gesture: Gesture) => void,
  onDragMove: ({ x: number, y: number }) => void,
};

type State = {
  isDragging: boolean,
  viewWidth: number,
  viewHeight: number,
};

// $FlowFixMe
@autobind
export default class DragInteractionContainer extends Component<Props, State> {
  props: Props;
  state: State;
  view: ?View;
  panResponder: PanResponder;
  pan: Animated.ValueXY = new Animated.ValueXY();
  panOffset: { x: number, y: number } = { x: 0, y: 0 };

  static defaultProps = {
    itemsShouldReturnToOriginalPosition: true,
    horizontal: true,
    vertical: true,
    applyTransformStyles: true,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      isDragging: false,
      viewWidth: 0,
      viewHeight: 0,
    };
    this.pan.addListener(this.panListener);
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => this.canDrag(),
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: this.handleMove,
      onPanResponderGrant: this.handleGrant,
      onPanResponderRelease: this.handleRelease,
      onPanResponderTerminate: this.handleRelease,
    });
  }

  panListener(value: { x: number, y: number }) {
    this.panOffset = value;
    this.props.onDragMove(value);
  }

  canDrag(): boolean {
    if (isNil(this.props.canDrag)) {
      return true;
    }
    return !!this.props.canDrag;
  }

  handleMove(event: Event, gesture: Gesture) {
    if (!this.canDrag()) {
      return;
    }
    return Animated.event([
      null,
      extend(
        {},
        this.props.horizontal && {
          dx: this.pan.x,
        },
        this.props.vertical && {
          dy: this.pan.y,
        }
      ),
    ])(event, gesture);
  }

  handleGrant(event: Event, gesture: Gesture) {
    if (!this.canDrag()) {
      return;
    }
    this.setState({
      isDragging: true,
    });
    this.pan.setOffset(this.panOffset);
    this.pan.setValue({ x: 0, y: 0 });
    this.props.onDragStart(event, gesture);
  }

  handleRelease(event: Event, gesture: Gesture) {
    this.setState({
      isDragging: false,
    });
    this.animateRelease();
    this.props.onDragEnd(event, gesture);
  }

  animateRelease() {
    if (!this.props.itemsShouldReturnToOriginalPosition) {
      return;
    }
    Animated.spring(this.pan, {
      toValue: { x: 0, y: 0 },
    }).start();
  }

  viewDidLayout() {
    if (!this.view) {
      return;
    }
    this.view.measure((fx, fy, width, height) => {
      this.setState({ viewWidth: width, viewHeight: height });
    });
  }

  render() {
    const dragStyles = [
      this.props.applyTransformStyles && {
        transform: [
          {
            translateX: Animated.diffClamp(this.pan.x, 0, this.state.viewWidth),
          },
          {
            translateY: Animated.diffClamp(
              this.pan.y,
              0,
              this.state.viewHeight
            ),
          },
        ],
      },
      this.state.isDragging && { zIndex: 1000 },
    ];
    const style = this.canDrag() ? dragStyles : {};
    return (
      <View
        style={this.props.style}
        ref={ref => {
          this.view = ref;
        }}
        onLayout={this.viewDidLayout}
      >
        <Animated.View {...this.panResponder.panHandlers} style={style}>
          {this.props.renderChildren({
            isDragging: this.state.isDragging && this.canDrag(),
          })}
          {/* {cloneElement(Children.only(this.props.children), {
            isDragging: this.state.isDragging && this.canDrag(),
          })} */}
        </Animated.View>
      </View>
    );
  }
}
