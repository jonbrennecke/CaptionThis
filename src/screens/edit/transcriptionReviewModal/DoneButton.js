// @flow
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { BackIcon } from '../../../components/icons';
import { Colors, Units } from '../../../constants';
import * as Fonts from '../../../utils/Fonts';

import type { SFC, Style } from '../../../types';

export type DoneButtonProps = {
  style?: ?Style,
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
  text: {
    ...Fonts.getFontStyle('default'),
    color: Colors.solid.nimbus,
    fontSize: 17,
  },
};

export const DoneButton: SFC<DoneButtonProps> = ({
  style,
  onPress,
}: DoneButtonProps) => (
  <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
    <BackIcon style={styles.icon} color={Colors.solid.nimbus} />
    <Text style={styles.text}>Done</Text>
  </TouchableOpacity>
);
