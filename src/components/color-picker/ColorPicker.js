// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { autobind } from 'core-decorators';

import HuePicker from './HuePicker';
import SaturationAndBrightnessPicker from './SaturationAndBrightnessPicker';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';

type Props = {
  style?: ?Style,
  color: ColorRGBA,
  onDidUpdateColor: ColorRGBA => void,
  onRequestLockScroll?: () => void,
  onRequestUnlockScroll?: () => void,
};

type State = {
  viewWidth: number,
};

const styles = {
  satPicker: (width: number) => ({
    width,
    height: width,
    backgroundColor: 'transparent',
  }),
  huePicker: (width: number) => ({
    width,
    height: 45,
    borderRadius: 10,
    marginTop: 35,
    backgroundColor: 'transparent',
  }),
};

// $FlowFixMe
@autobind
export default class ColorPicker extends Component<Props, State> {
  view: ?View;
  state: State = {
    viewWidth: 0,
  };

  viewDidLayout() {
    if (!this.view) {
      return;
    }
    this.view.measure((fx, fy, width) => {
      this.setState({ viewWidth: width });
    });
  }

  render() {
    return (
      <View
        style={this.props.style}
        ref={ref => {
          this.view = ref;
        }}
        onLayout={this.viewDidLayout}
      >
        <SaturationAndBrightnessPicker
          style={styles.satPicker(this.state.viewWidth)}
          color={this.props.color}
          onDidUpdateColor={this.props.onDidUpdateColor}
          onDidStartDrag={this.props.onRequestLockScroll}
          onDidEndDrag={this.props.onRequestUnlockScroll}
        />
        <HuePicker
          style={styles.huePicker(this.state.viewWidth)}
          color={this.props.color}
          onDidUpdateColor={this.props.onDidUpdateColor}
          onDidStartDrag={this.props.onRequestLockScroll}
          onDidEndDrag={this.props.onRequestUnlockScroll}
        />
      </View>
    );
  }
}
