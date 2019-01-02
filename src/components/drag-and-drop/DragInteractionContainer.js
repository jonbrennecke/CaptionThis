// @flow
import React, { cloneElement, Component, Children } from 'react';
import { PanResponder, Animated } from 'react-native';
import { autobind } from 'core-decorators';
import isNil from 'lodash/isNil';
import extend from 'lodash/extend';

import type {
  Gesture,
  Children as ChildrenType,
  Style,
} from '../../types/react';

type Props = {
  itemsShouldReturnToOriginalPosition?: boolean,
  canDrag?: boolean,
  vertical?: boolean,
  horizontal?: boolean,
  applyTransformStyles?: boolean,
  style?: Style,
  children: ChildrenType,
  onDragStart: (event: Event, gesture: Gesture) => void,
  onDragEnd: (event: Event, gesture: Gesture) => void,
  onDragMove: ({ x: number, y: number }) => void,
};

type State = {
  isDragging: boolean,
};

// $FlowFixMe
@autobind
export default class DragInteractionContainer extends Component<Props, State> {
  props: Props;
  state: State;
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
    };
    this.pan.addListener((value: { x: number, y: number }) => {
      this.panOffset = value;
      this.props.onDragMove(value);
    });
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => this.canDrag(),
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: this.handleMove,
      onPanResponderGrant: this.handleGrant,
      onPanResponderRelease: this.handleRelease,
      onPanResponderTerminate: this.handleRelease,
    });
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

  render() {
    const dragStyles = [
      this.props.applyTransformStyles && {
        transform: this.pan.getTranslateTransform(),
      },
      this.state.isDragging && { zIndex: 1000 },
    ];
    const style = [this.props.style, this.canDrag() ? dragStyles : {}];
    return (
      <Animated.View {...this.panResponder.panHandlers} style={style}>
        {cloneElement(Children.only(this.props.children), {
          isDragging: this.state.isDragging && this.canDrag(),
        })}
      </Animated.View>
    );
  }
}
