// @flow
import React from 'react';
import { View } from 'react-native';
// eslint-disable-next-line import/no-named-as-default
import Svg, { Path } from 'react-native-svg';

import * as Color from '../../../../utils/Color';

import type { Style, SFC } from '../../../../types/react';
import type { ColorRGBA } from '../../../../types/media';

export type MediaGridHeaderAlbumsIconProps = {
  style?: ?Style,
  color: ColorRGBA,
};

const styles = {
  container: {},
  flex: {
    flex: 1,
  },
};

export const MediaGridHeaderAlbumsIcon: SFC<MediaGridHeaderAlbumsIconProps> = ({
  style,
  color,
}: MediaGridHeaderAlbumsIconProps) => (
  <View style={[styles.container, style]}>
    <Svg style={styles.flex} viewBox="0 0 512 512">
      <Path
        fill={Color.rgbaObjectToRgbaString(color)}
        d="M460.9 161H51.1C31.8 161 16 176.8 16 196.1V428c0 19.3 15.8 35.1 35.1 35.1H461c19.3 0 35.1-15.8 35.1-35.1V196.1c-.1-19.3-15.9-35.1-35.2-35.1zM434 133H78c-7.7 0-14-6.3-14-14s6.3-14 14-14h356c7.7 0 14 6.3 14 14s-6.3 14-14 14zM403.2 77H108.8c-7 0-12.8-5.8-12.8-12.8v-2.4c0-7 5.8-12.8 12.8-12.8h294.4c7 0 12.8 5.8 12.8 12.8v2.4c0 7-5.8 12.8-12.8 12.8z"
      />
    </Svg>
  </View>
);
