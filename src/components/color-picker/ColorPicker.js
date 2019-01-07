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
  container: {
    flexDirection: 'row',
  },
  satPickerWrap: {
    flex: 1,
  },
  huePickerWrap: {
    flex: 0.3,
  },
  satPicker: (width: number) => ({
    width,
    height: width,
  }),
  huePicker: {
    flex: 1,
    borderRadius: 10,
    marginLeft: 15,
  },
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
      <View style={[styles.container, this.props.style]}>
        <View
          style={styles.satPickerWrap}
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
        </View>
        <View style={styles.huePickerWrap}>
          <HuePicker
            style={styles.huePicker}
            color={this.props.color}
            onDidUpdateColor={this.props.onDidUpdateColor}
            onDidStartDrag={this.props.onRequestLockScroll}
            onDidEndDrag={this.props.onRequestUnlockScroll}
          />
        </View>
      </View>
    );
  }
}
