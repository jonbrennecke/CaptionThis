// @flow
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { RewindIcon } from '../../../components/icons';
import { Colors, Units } from '../../../constants';
import * as Fonts from '../../../utils/Fonts';

import type { SFC, Style } from '../../../types';

export type FastForwardButtonProps = {
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
        rotate: '45deg',
      },
    ],
  },
  text: {
    ...Fonts.getFontStyle('default'),
    color: Colors.solid.nimbus,
    marginLeft: Units.extraSmall,
  },
};

export const FastForwardButton: SFC<FastForwardButtonProps> = ({
  style,
  onPress,
}: FastForwardButtonProps) => (
  <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
    <RewindIcon style={styles.icon} color={Colors.solid.nimbus} />
    <Text style={styles.text}>5s</Text>
  </TouchableOpacity>
);
