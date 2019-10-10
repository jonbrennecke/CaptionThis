// @flow
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { RewindIcon } from '../../../components/icons';
import { Colors, Units } from '../../../constants';
import * as Fonts from '../../../utils/Fonts';

import type { SFC, Style } from '../../../types';

export type RewindButtonProps = {
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
  text: {
    ...Fonts.getFontStyle('default'),
    color: Colors.solid.nimbus,
    marginRight: Units.extraSmall,
  },
};

export const RewindButton: SFC<RewindButtonProps> = ({
  style,
  onPress,
}: RewindButtonProps) => (
  <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
    <Text style={styles.text}>5s</Text>
    <RewindIcon style={styles.icon} color={Colors.solid.nimbus} />
  </TouchableOpacity>
);
