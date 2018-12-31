// @flow
import React from 'react';
import { View } from 'react-native';

import CaptureButton from '../../components/capture-button/CaptureButton';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  onRequestBeginCapture: () => void,
  onRequestEndCapture: () => void,
};

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
  },
};

export default function HomeScreenCaptureControls({
  style,
  onRequestBeginCapture,
  onRequestEndCapture,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <CaptureButton
        onRequestBeginCapture={onRequestBeginCapture}
        onRequestEndCapture={onRequestEndCapture}
      />
    </View>
  );
}
