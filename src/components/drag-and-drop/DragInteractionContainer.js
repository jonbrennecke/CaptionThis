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
  style?: Style,
  children: ChildrenType,
  onDragStart: (event: Event, gesture: Gesture) => void,
  onDragEnd: (event: Event, gesture: Gesture) => void,
  onDragMove: (event: Event, gesture: Gesture) => void,
};

type State = {
  pan: Animated.ValueXY,
  isDragging: boolean,
};

// $FlowFixMe
@autobind
export default class DragInteractionContainer extends Component<Props, State> {
  props: Props;
  state: State;
  panResponder: PanResponder;

  static defaultProps = {
    itemsShouldReturnToOriginalPosition: true,
    horizontal: true,
    vertical: true,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
      isDragging: false,
    };
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
    this.props.onDragMove(event, gesture);
    return Animated.event([
      null,
      extend(
        {},
        this.props.horizontal && {
          moveX: this.state.pan.x
        },
        this.props.vertical && {
          moveY: this.state.pan.y
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
    Animated.spring(this.state.pan, {
      toValue: { x: 0, y: 0 },
    }).start();
  }

  render() {
    const dragStyles = [
      this.state.pan.getLayout(),
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
