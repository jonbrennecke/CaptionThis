// @flow
import React from 'react';
import { View } from 'react-native';

import * as Fonts from '../../../../utils/Fonts';

import type { SFC, Children } from '../../../../types/react';

export type MediaGridHeaderProps = {
  children?: ?Children,
};

const styles = {
  mediaHeader: {
    paddingVertical: 5,
    paddingHorizontal: 7,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  mediaText: Fonts.getFontStyle('title', { contentStyle: 'lightContent' }),
};

export const MediaGridHeader: SFC<MediaGridHeaderProps> = ({
  children,
}: MediaGridHeaderProps) => <View style={styles.mediaHeader}>{children}</View>;
