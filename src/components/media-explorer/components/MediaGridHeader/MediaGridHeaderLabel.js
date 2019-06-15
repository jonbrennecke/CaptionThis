// @flow
import React from 'react';
import { Text } from 'react-native';

import * as Fonts from '../../../../utils/Fonts';

import type { SFC } from '../../../../types/react';

export type MediaGridHeaderLabelProps = {
  text: string,
};

const styles = {
  text: Fonts.getFontStyle('title', { contentStyle: 'lightContent' }),
};

export const MediaGridHeaderLabel: SFC<MediaGridHeaderLabelProps> = ({
  text,
}: MediaGridHeaderLabelProps) => <Text style={styles.text}>{text}</Text>;
