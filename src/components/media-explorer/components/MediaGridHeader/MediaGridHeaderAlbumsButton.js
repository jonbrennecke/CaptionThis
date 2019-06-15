// @flow
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import * as Fonts from '../../../../utils/Fonts';
import * as Color from '../../../../utils/Color';
import { UI_COLORS } from '../../../../constants';

import { MediaGridHeaderAlbumsIcon } from './MediaGridHeaderAlbumsIcon';

import type { SFC } from '../../../../types/react';

export type MediaGridHeaderAlbumsButtonProps = {
  text: string,
  onPress: () => void,
};

const styles = {
  container: {
    flexDirection: 'row',
  },
  icon: {
    height: 25,
    width: 25,
    marginRight: 8,
  },
  text: Fonts.getFontStyle('title', { contentStyle: 'lightContent' }),
};

// eslint-disable-next-line flowtype/generic-spacing
export const MediaGridHeaderAlbumsButton: SFC<
  MediaGridHeaderAlbumsButtonProps
> = ({ text, onPress }: MediaGridHeaderAlbumsButtonProps) => (
  <TouchableOpacity onPress={onPress} style={styles.container}>
    <MediaGridHeaderAlbumsIcon
      color={Color.hexToRgbaObject(UI_COLORS.WHITE)}
      style={styles.icon}
    />
    <Text style={styles.text}>{text}</Text>
  </TouchableOpacity>
);
