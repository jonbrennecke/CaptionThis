// @flow
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { RewindIcon } from '../../../components/icons';
import { Colors, Units } from '../../../constants';
import * as Fonts from '../../../utils/Fonts';

import type { SFC, Style } from '../../../types';

export type FastForwardButtonProps = {
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
        rotate: '45deg',
      },
    ],
  },
  text: (color: $Values<typeof Colors.solid>) => ({
    ...Fonts.getFontStyle('default'),
    color,
    marginLeft: Units.extraSmall,
  }),
};

export const FastForwardButton: SFC<FastForwardButtonProps> = ({
  style,
  color,
  onPress,
}: FastForwardButtonProps) => (
  <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
    <RewindIcon style={styles.icon} color={color} />
    <Text style={styles.text(color)}>5s</Text>
  </TouchableOpacity>
);
