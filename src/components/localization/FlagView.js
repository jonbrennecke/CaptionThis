// @flow
import React from 'react';
import { Image } from 'react-native';

import type { Style } from '../../types/react';

type Props = {
  countryCode: string,
  style?: ?Style,
};

export default function FlagView({ style, countryCode }: Props) {
  return (
    <Image style={style} source={{ uri: `${countryCode.toLocaleUpperCase()}`, bundle: 'FlagKit' }} />
  );
}