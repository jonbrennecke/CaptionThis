// @flow
import React from 'react';
import { View } from 'react-native';
// eslint-disable-next-line import/no-named-as-default
import Svg, { Path } from 'react-native-svg';

import * as Color from '../../../../utils/Color';

import type { Style, SFC } from '../../../../types/react';
import type { ColorRGBA } from '../../../../types/media';

export type MediaGridHeaderCloseIconProps = {
  style?: ?Style,
  color: ColorRGBA,
};

const styles = {
  container: {},
  flex: {
    flex: 1,
  },
};

export const MediaGridHeaderCloseIcon: SFC<MediaGridHeaderCloseIconProps> = ({
  style,
  color,
}: MediaGridHeaderCloseIconProps) => (
  <View style={[styles.container, style]}>
    <Svg style={styles.flex} viewBox="0 0 512 512">
      <Path
        fill={Color.rgbaObjectToRgbaString(color)}
        d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"
      />
    </Svg>
  </View>
);
