// @flow
import React from 'react';
import { Image } from 'react-native';

import * as Debug from '../../utils/Debug';

import type { Style } from '../../types/react';

type Props = {
  countryCode: string,
  style?: ?Style,
};

export default function FlagView({ style, countryCode }: Props) {
  // Spanish (Latin America) does not have a matching flag so a default flag (Argentina) is shown instead
  if (countryCode === '419') {
    return <Image style={style} source={{ uri: 'AR', bundle: 'FlagKit' }} />;
  }
  return (
    <Image
      style={style}
      source={{ uri: `${countryCode.toLocaleUpperCase()}`, bundle: 'FlagKit' }}
      defaultSource={{ uri: 'US', bundle: 'FlagKit' }}
      onError={() => {
        Debug.logWarningMessage(
          `Couldn't find the flag image for countryCode = ${countryCode}`
        );
      }}
    />
  );
}
