// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { autobind } from 'core-decorators';

import SaturationAndBrightnessGradientView from './SaturationAndBrightnessGradientView';

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
        <View style={styles.colorPicker(this.state.viewWidth)}>
          <SaturationAndBrightnessGradientView style={styles.flex} />
        </View>
        {/* <HueGradientView
        /> */}
      </View>
    );
  }
}
