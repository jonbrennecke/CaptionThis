// @flow
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { BackIcon } from '../../../components/icons';
import { Colors, Units } from '../../../constants';
import * as Fonts from '../../../utils/Fonts';

import type { SFC, Style } from '../../../types';

export type DoneButtonProps = {
  style?: ?Style,
  color: $Values<typeof Colors.solid>,
  onPress: () => void,
};

const styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  icon: {
    height: Units.extraLarge,
    width: Units.extraLarge,
  },
  text: (color: $Values<typeof Colors.solid>) => ({
    ...Fonts.getFontStyle('default'),
    color,
    fontSize: 17,
  }),
};

export const DoneButton: SFC<DoneButtonProps> = ({
  style,
  color,
  onPress,
}: DoneButtonProps) => (
  <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
    <BackIcon style={styles.icon} color={color} />
    <Text style={styles.text(color)}>Done</Text>
  </TouchableOpacity>
);
