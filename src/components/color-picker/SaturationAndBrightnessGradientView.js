// @flow
import React from 'react';
import { requireNativeComponent } from 'react-native';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
};

const NativeSaturationAndBrightnessGradientView = requireNativeComponent(
  'SaturationAndBrightnessGradientView'
);

export default function SaturationAndBrightnessGradientView({ style }: Props) {
  return <NativeSaturationAndBrightnessGradientView style={style} />;
}
