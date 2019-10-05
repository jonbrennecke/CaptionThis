// @flow
import React, { PureComponent, createRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import noop from 'lodash/noop';
import clamp from 'lodash/clamp';

import { PanGestureHandler } from '../gesture-handlers';

import type { Element } from 'react';

import type { Style, Children } from '../../types/react';

export type SliderProps = {
  style?: ?(Style | Array<Style>),
  children?: ?Children,
  handleStyle?: ?Style,
  progress?: number,
  initialProgress?: number,
  renderHandle?: (props: Object) => Element<*>,
  onSeekToProgress: (progress: number) => void,
  onDidBeginDrag?: () => void,
  onDidEndDrag?: (progress: number) => void,
};

export type SliderState = {
  isDragging: boolean,
  viewWidth: number,
};

const styles = {
  container: {},
  handle: {
    position: 'absolute',
  },
  dragContainer: StyleSheet.absoluteFillObject,
};

export class Slider extends PureComponent<SliderProps, SliderState> {
  static defaultProps = {
    onDidBeginDrag: noop,
    onDidEndDrag: noop,
  };

  state: SliderState = {
    viewWidth: 0,
    isDragging: false,
  };
  dragRef = createRef();

  componentDidUpdate(prevProps: SliderProps) {
    if (this.props.progress != prevProps.progress) {
      this.dragRef.current &&
        this.dragRef.current.setPanValue(
          this.makePanValueWithProgress(this.props.progress || 0)
        );
    }
  }

  dragDidStart = () => {
    if (this.props.onDidBeginDrag) {
      this.props.onDidBeginDrag();
    }
    this.setState({
      isDragging: true,
    });
  };

  dragDidEnd = ({ x }: { x: number, y: number }) => {
    this.setState({
      isDragging: false,
    });
    const progress = clamp(x / this.state.viewWidth, 0, 1);
    if (this.props.onDidEndDrag) {
      this.props.onDidEndDrag(progress);
    }
  };

  dragDidMove = ({ x }: { x: number, y: number }) => {
    if (!this.props.onSeekToProgress) {
      return;
    }
    const progress = clamp(x / this.state.viewWidth, 0, 1);
    this.props.onSeekToProgress(progress);
  };

  viewDidLayout = ({ nativeEvent: { layout } }: any) => {
    this.setState({ viewWidth: layout.width }, () => {
      if (this.dragRef.current) {
        this.dragRef.current.setPanValue(this.makeInitialPanValue());
      }
    });
  };

  makeInitialPanValue(): { x: number, y: number } {
    return this.makePanValueWithProgress(this.props.initialProgress || 0);
  }

  makePanValueWithProgress(progress: number): { x: number, y: number } {
    return {
      x: clamp(progress, 0, 1) * this.state.viewWidth,
      y: 0,
    };
  }

  render() {
    return (
      <View
        style={[styles.container, this.props.style]}
        onLayout={this.viewDidLayout}
      >
        {this.props.children}
        <PanGestureHandler
          ref={this.dragRef}
          style={styles.dragContainer}
          vertical={false}
          initialValue={this.makeInitialPanValue()}
          returnToOriginalPosition={false}
          onDragStart={this.dragDidStart}
          onDragEnd={this.dragDidEnd}
          onDragMove={this.dragDidMove}
          renderChildren={props =>
            this.props.renderHandle ? (
              this.props.renderHandle({
                style: [styles.handle, this.props.handleStyle],
                pointerEvents: 'none',
                ...props,
              })
            ) : (
              <Animated.View
                {...props}
                pointerEvents="none"
                style={[props.style, styles.handle, this.props.handleStyle]}
              />
            )
          }
        />
      </View>
    );
  }
}
