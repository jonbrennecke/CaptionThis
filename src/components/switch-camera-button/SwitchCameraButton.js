// @flow
import React from 'react';
import { TouchableOpacity, MaskedViewIOS } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
        <LinearGradient
          pointerEvents="none"
          useAngle
          angle={-45}
          angleCenter={{ x: 0.5, y: 0.5 }}
          colors={[UI_COLORS.LIGHT_GREEN, UI_COLORS.MEDIUM_GREEN]}
          style={styles.absoluteFill}
        />
      </MaskedViewIOS>
    </TouchableOpacity>
  );
}
