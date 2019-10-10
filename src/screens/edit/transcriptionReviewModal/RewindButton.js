// @flow
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { RewindIcon } from '../../../components/icons';
import { Colors, Units } from '../../../constants';
import * as Fonts from '../../../utils/Fonts';

import type { SFC, Style } from '../../../types';

export type RewindButtonProps = {
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
    height: Units.large,
    width: Units.large,
    transform: [
      {
        scaleX: -1,
      },
      {
        rotate: '45deg',
      },
    ],
  },
  text: (color: $Values<typeof Colors.solid>) => ({
    ...Fonts.getFontStyle('default'),
    color,
    marginRight: Units.extraSmall,
  }),
};

export const RewindButton: SFC<RewindButtonProps> = ({
  style,
  color,
  onPress,
}: RewindButtonProps) => (
  <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
    <Text style={styles.text(color)}>5s</Text>
    <RewindIcon style={styles.icon} color={color} />
  </TouchableOpacity>
);
