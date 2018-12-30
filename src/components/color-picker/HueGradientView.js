// @flow
import React from 'react';
import { requireNativeComponent } from 'react-native';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
};

const NativeHueGradientView = requireNativeComponent(
  'HueGradientView'
);

export default function HueGradientView({ style }: Props) {
  return <NativeHueGradientView style={style} />;
}