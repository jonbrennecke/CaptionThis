// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { autobind } from 'core-decorators';

import HuePicker from './HuePicker';
import SaturationAndBrightnessPicker from './SaturationAndBrightnessPicker';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
};

type State = {
  viewWidth: number,
};

const styles = {
  flex: {
    flex: 1,
  },
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
        style={[styles.flex, this.props.style]}
        ref={ref => {
          this.view = ref;
        }}
        onLayout={this.viewDidLayout}
      >
        <SaturationAndBrightnessPicker
          style={styles.satPicker(this.state.viewWidth)}
        />
        <HuePicker style={styles.huePicker(this.state.viewWidth)} />
      </View>
    );
  }
}
