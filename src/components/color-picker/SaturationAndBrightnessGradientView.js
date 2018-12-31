// @flow
import React from 'react';
import { requireNativeComponent } from 'react-native';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';

type Props = {
  style?: ?Style,
  color: ColorRGBA,
  offset: { x: number, y: number },
  onDidUpdateColor: ColorRGBA => void,
};

const NativeSaturationAndBrightnessGradientView = requireNativeComponent(
  'SaturationAndBrightnessGradientView'
);

export default function SaturationAndBrightnessGradientView({
  style,
  color,
  offset,
  onDidUpdateColor,
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
      offset={offset}
      onDidUpdateColorAtOffset={({ nativeEvent }: any) => {
        if (!nativeEvent) {
          return;
        }
        const { red, green, blue, alpha } = nativeEvent;
        onDidUpdateColor({
          red: red * 255,
          green: green * 255,
          blue: blue * 255,
          alpha,
        });
      }}
    />
  );
}
