// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { autobind } from 'core-decorators';

import SaturationAndBrightnessGradientView from './SaturationAndBrightnessGradientView';
import HueGradientView from './HueGradientView';

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
  colorPicker: (width: number) => ({
    width,
    height: width,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  }),
  huePicker: (width: number) => ({
    width,
    height: 45,
    borderRadius: 10,
    marginTop: 35,
    overflow: 'hidden',
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
        <SaturationAndBrightnessGradientView style={styles.colorPicker(this.state.viewWidth)} />
        <HueGradientView
          style={styles.huePicker(this.state.viewWidth)}
        />
      </View>
    );
  }
}
