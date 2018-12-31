// @flow
import React from 'react';
import { View } from 'react-native';

import CaptureButton from '../../components/capture-button/CaptureButton';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
};

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
  },
};

export default function HomeScreenCaptureControls(props: Props) {
  return (
    <View style={[styles.container, props.style]}>
      <CaptureButton />
    </View>
  );
}
