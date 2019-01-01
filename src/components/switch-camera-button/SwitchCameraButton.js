// @flow
import React from 'react';
import { TouchableOpacity } from 'react-native';

import SwitchCameraIcon from './SwitchCameraIcon';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  onRequestSwitchCamera: () => void,
};

const styles = {
  container: {},
  flex: {
    flex: 1,
  },
};

export default function SwitchCameraButton({
  style,
  onRequestSwitchCamera,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onRequestSwitchCamera}
      style={[styles.container, style]}
    >
      <SwitchCameraIcon style={styles.flex} />
    </TouchableOpacity>
  );
}
