// @flow
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { ResizeIcon } from '../icons';
import { Units, Colors } from '../../constants';

import type { SFC, Style } from '../../types';

export type MinimizeButtonProps = {
  style?: ?Style,
  onPress: () => void,
};

const styles = {
  container: {
    width: Units.extraLarge,
    height: Units.extraLarge,
    // backgroundColor: Colors.solid.white,
    borderRadius: Units.extraLarge * 0.5,
    padding: Units.extraSmall,
  },
  icon: {
    flex: 1,
  },
};

export const MinimizeButton: SFC<MinimizeButtonProps> = ({
  style,
  onPress,
}: MinimizeButtonProps) => (
  <TouchableOpacity
    disabled
    style={[styles.container, style]}
    onPress={onPress}
  >
    <ResizeIcon style={styles.icon} color={Colors.solid.nimbus} />
  </TouchableOpacity>
);
