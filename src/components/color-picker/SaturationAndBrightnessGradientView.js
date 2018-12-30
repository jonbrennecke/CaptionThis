// @flow
import React from 'react';
import { requireNativeComponent } from 'react-native';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';

type Props = {
  style?: ?Style,
  color: ColorRGBA,
};

const NativeSaturationAndBrightnessGradientView = requireNativeComponent(
  'SaturationAndBrightnessGradientView'
);

export default function SaturationAndBrightnessGradientView({
  style,
  color,
}: Props) {
  return (
    <NativeSaturationAndBrightnessGradientView
      style={style}
      color={[
        color.red / 255,
        color.green / 255,
        color.blue / 255,
        color.alpha,
      ]}
    />
  );
}
