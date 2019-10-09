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
    width: Units.large,
    height: Units.large,
    backgroundColor: Colors.solid.white,
    borderRadius: Units.large * 0.5,
    padding: Units.extraSmall,
    borderWidth: 1,
  },
  icon: {
    flex: 1,
  },
};

export const MinimizeButton: SFC<MinimizeButtonProps> = ({
  style,
  onPress,
}: MinimizeButtonProps) => (
  <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
    <ResizeIcon style={styles.icon} color={Colors.solid.nimbus} />
  </TouchableOpacity>
);
