// @flow
import React, { PureComponent, createRef } from 'react';
import { PanResponder, Animated, View, Easing, StyleSheet } from 'react-native';
import { autobind } from 'core-decorators';
import stubTrue from 'lodash/stubTrue';
import stubFalse from 'lodash/stubFalse';
import compact from 'lodash/compact';
import clamp from 'lodash/clamp';
import throttle from 'lodash/throttle';

import type { Gesture, Style } from '../../types/react';
import type { Element } from 'react';

type RenderChildrenProps = {
  isDragging: boolean,
  style: Style,
};

export type PanGestureHandlerProps = {
  clampToBounds?: boolean,
  jumpToGrantedPosition?: boolean,
  returnToOriginalPosition?: boolean,
  attachPanHandlersToChildren?: boolean,
  initialValue?: { x: number, y: number },
  disabled?: boolean,
  vertical?: boolean,
  horizontal?: boolean,
  shouldApplyTransformStyles?: boolean,
  style?: ?(Style | Array<Style>),
  renderChildren: (props: RenderChildrenProps) => Element<*>,
  onDragStart?: ({ x: number, y: number }, pan: Animated.ValueXY) => void,
  onDragEnd?: ({ x: number, y: number }) => void,
  onDragMove?: ({ x: number, y: number }) => void,
  onDragMoveEvent?: (event: any, gesture: Gesture) => void,
  onDragEndEvent?: (event: any, gesture: Gesture) => void,
};

export type PanGestureHandlerState = {
  isDragging: boolean,
  viewWidth: number,
  viewHeight: number,
  viewPageX: number,
  viewPageY: number,
  childViewWidth: number,
  childViewHeight: number,
};

// $FlowFixMe
@autobind
export class PanGestureHandler extends PureComponent<
  PanGestureHandlerProps,
  PanGestureHandlerState
> {
  props: PanGestureHandlerProps;
  state: PanGestureHandlerState;
  panResponder: ?PanResponder = null;
  pan: Animated.ValueXY = new Animated.ValueXY();
  panOffset: { x: number, y: number } = { x: 0, y: 0 };
  containerRef = createRef();
  panResponderRef = createRef();

  static defaultProps = {
    clampToBounds: true,
    jumpToGrantedPosition: true,
    returnToOriginalPosition: true,
    attachPanHandlersToChildren: false,
    horizontal: true,
    vertical: true,
    shouldApplyTransformStyles: true,
    initialValue: { x: 0, y: 0 },
  };

  constructor(props: PanGestureHandlerProps) {
    super(props);
    this.pan.setValue(
      props.initialValue || PanGestureHandler.defaultProps.initialValue
    );
    this.state = {
      isDragging: false,
      viewWidth: 0,
      viewHeight: 0,
      viewPageX: 0,
      viewPageY: 0,
      childViewHeight: 0,
      childViewWidth: 0,
    };
  }

  componentDidMount() {
    this.pan.addListener(this.panListenerThrottled);
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: stubTrue,
      onStartShouldSetPanResponderCapture: stubFalse,
      onMoveShouldSetPanResponder: (event, gesture) => {
        const { dx, dy } = gesture;
        if (this.props.vertical && !this.props.horizontal) {
          return Math.abs(dy) > Math.abs(dx);
        } else if (this.props.horizontal && !this.props.vertical) {
          return Math.abs(dx) > Math.abs(dy);
        }
        return true;
      },
      onPanResponderMove: this.handleMove,
      onPanResponderGrant: this.handleGrant,
      onPanResponderRelease: this.handleRelease,
      onPanResponderTerminate: this.handleRelease,
    });
  }

  componentWillUnmount() {
    this.pan.removeAllListeners();
  }

  setPanValue(value: { x: number, y: number }) {
    if (this.state.isDragging) {
      return;
    }
    this.pan.flattenOffset();
    this.pan.setValue(value);
  }

  panListenerThrottled = throttle(this.panListener, 100, {
    leading: true,
  });

  panListener(value: { x: number, y: number }) {
    if (!this.state.isDragging) {
      return;
    }
    const x = value.x - this.state.viewPageX;
    const y = value.y - this.state.viewPageY;
    const panOffset = this.props.clampToBounds
      ? {
          x: x,
          y: y,
        }
      : {
          x: clamp(x, 0, this.state.viewWidth),
          y: clamp(y, 0, this.state.viewHeight),
        };
    this.props.onDragMove && this.props.onDragMove(value);
    this.panOffset = panOffset;
  }

  handleMove(event: Event, gesture: Gesture) {
    Animated.event([
      null,
      {
        dx: this.pan.x,
        dy: this.pan.y,
      },
    ])(event, gesture);
    this.props.onDragMoveEvent && this.props.onDragMoveEvent(event, gesture);
  }

  handleGrant(event: any, gesture: Gesture) {
    if (this.props.disabled) {
      return;
    }
    this.pan.addListener(this.panListenerThrottled);
    this.setState({
      isDragging: true,
    });
    this.panOffset = this.props.jumpToGrantedPosition
      ? {
          x: gesture.x0 - this.state.viewPageX,
          y: gesture.y0 - this.state.viewPageY,
        }
      : {
          x: gesture.x0 - this.state.viewPageX - event.nativeEvent.locationX,
          y: gesture.y0 - this.state.viewPageY - event.nativeEvent.locationY,
        };
    this.pan.setOffset(this.panOffset);
    this.pan.setValue({ x: 0, y: 0 });
    this.props.onDragStart && this.props.onDragStart(this.panOffset, this.pan);
  }

  handleRelease(event: any, gesture: Gesture) {
    this.panOffset = this.props.jumpToGrantedPosition
      ? {
          x: gesture.x0 + gesture.dx - this.state.viewPageX,
          y: gesture.y0 + gesture.dy - this.state.viewPageY,
        }
      : {
          x:
            gesture.x0 +
            gesture.dx -
            this.state.viewPageX -
            event.nativeEvent.locationX,
          y:
            gesture.y0 +
            gesture.dy -
            this.state.viewPageY -
            event.nativeEvent.locationY,
        };
    this.pan.setOffset(this.panOffset);
    this.pan.setValue({ x: 0, y: 0 });
    this.pan.removeAllListeners();
    this.setState({
      isDragging: false,
    });
    this.animateRelease();
    this.props.onDragEnd && this.props.onDragEnd(this.panOffset);
  }

  animateRelease() {
    if (!this.props.returnToOriginalPosition) {
      return;
    }
    this.pan.flattenOffset();
    Animated.timing(this.pan, {
      toValue: { x: 0, y: 0 },
      easing: Easing.out(Easing.quad),
    }).start();
  }

  viewDidLayout({ nativeEvent }: any) {
    if (!this.containerRef.current || !nativeEvent) {
      return;
    }
    const {
      layout: { width, height },
    } = nativeEvent;
    this.containerRef.current.measure(
      (x, y, unusedWidth, unusedHeight, pageX, pageY) => {
        this.setState({
          viewWidth: width,
          viewHeight: height,
          viewPageX: pageX,
          viewPageY: pageY,
        });
      }
    );
  }

  childViewDidLayout({ nativeEvent }: any) {
    const {
      layout: { width, height },
    } = nativeEvent;
    this.setState({
      childViewWidth: width,
      childViewHeight: height,
    });
  }

  render() {
    const style = this.props.shouldApplyTransformStyles
      ? {
          transform: compact([
            this.props.horizontal && {
              translateX: this.props.clampToBounds
                ? this.pan.x.interpolate({
                    inputRange: [
                      0,
                      Math.max(
                        this.state.viewWidth - this.state.childViewWidth,
                        0
                      ),
                    ],
                    outputRange: [
                      0,
                      Math.max(
                        this.state.viewWidth - this.state.childViewWidth,
                        0
                      ),
                    ],
                    extrapolate: 'clamp',
                  })
                : this.pan.x,
            },
            this.props.vertical && {
              translateY: this.props.clampToBounds
                ? this.pan.y.interpolate({
                    inputRange: [
                      0,
                      Math.max(
                        this.state.viewHeight - this.state.childViewHeight,
                        0
                      ),
                    ],
                    outputRange: [
                      0,
                      Math.max(
                        this.state.viewHeight - this.state.childViewHeight,
                        0
                      ),
                    ],
                    extrapolate: 'clamp',
                  })
                : this.pan.y,
            },
          ]),
        }
      : {};
    return (
      <View
        style={[this.props.style, StyleSheet.absoluteFillObject]}
        ref={this.containerRef}
        onLayout={this.viewDidLayout}
        pointerEvents="box-none"
      >
        {this.props.attachPanHandlersToChildren ? (
          this.props.renderChildren({
            isDragging: this.state.isDragging,
            style,
            ...this.panResponder?.panHandlers,
            onLayout: this.childViewDidLayout,
          })
        ) : (
          <View
            style={StyleSheet.absoluteFill}
            ref={this.panResponderRef}
            {...this.panResponder?.panHandlers}
          >
            {this.props.renderChildren({
              isDragging: this.state.isDragging,
              style,
              onLayout: this.childViewDidLayout,
            })}
          </View>
        )}
      </View>
    );
  }
}
