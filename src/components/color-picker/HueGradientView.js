// @flow
import React, { Component } from 'react';
import { requireNativeComponent } from 'react-native';
import { autobind } from 'core-decorators';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';

type Props = {
  style?: ?Style,
  color: ColorRGBA,
  offset: { x: number },
  onDidUpdateColor: ColorRGBA => void,
};

const NativeHueGradientView = requireNativeComponent('HueGradientView');

// $FlowFixMe
@autobind
export default class HueGradientView extends Component<Props> {
  didUpdateColorAtOffset({ nativeEvent }: any) {
    if (!nativeEvent) {
      return;
    }
    const { red, green, blue, alpha } = nativeEvent;
    this.props.onDidUpdateColor({
      red: red * 255,
      green: green * 255,
      blue: blue * 255,
      alpha,
    });
  }

  render() {
    const { style, color, offset } = this.props;
    return (
      <NativeHueGradientView
        style={style}
        color={[
          color.red / 255,
          color.green / 255,
          color.blue / 255,
          color.alpha,
        ]}
        offset={offset}
        onDidUpdateColorAtOffset={this.didUpdateColorAtOffset}
      />
    );
  }
}
