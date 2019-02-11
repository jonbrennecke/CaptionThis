// @flow
import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import * as Color from '../../utils/Color';

import type { Style } from '../../types/react';

type Props = {
  styles?: ?Style,
};

const styles = {
  container: StyleSheet.absoluteFillObject,
};

export default function EditScreenLoadingBackground(props: Props) {
  return (
    <LinearGradient
      style={[styles.container, props.styles]}
      pointerEvents="none"
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={[
        Color.hexToRgbaString('#4F5BD5', 1),
        Color.hexToRgbaString('#456FF2', 1),
      ]}
    />
  );
}