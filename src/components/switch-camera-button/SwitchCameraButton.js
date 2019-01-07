// @flow
import React from 'react';
import { View, TouchableOpacity, MaskedViewIOS } from 'react-native';

import SwitchCameraIcon from './SwitchCameraIcon';
import { UI_COLORS } from '../../constants';

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
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: UI_COLORS.WHITE,
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
      <MaskedViewIOS
        style={styles.absoluteFill}
        maskElement={<SwitchCameraIcon style={styles.flex} />}
      >
        <View
          style={styles.absoluteFill}
        />
      </MaskedViewIOS>
    </TouchableOpacity>
  );
}
