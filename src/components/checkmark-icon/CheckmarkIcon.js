// @flow
import React from 'react';
import { View } from 'react-native';
// eslint-disable-next-line import/no-named-as-default
import Svg, { Path } from 'react-native-svg';

import * as Color from '../../utils/Color';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';

type Props = {
  style?: ?Style,
  color: ColorRGBA,
};

const styles = {
  container: {},
  flex: {
    flex: 1,
  },
};

// SVG copied from https://ionicons.com/ionicons/svg/icheckmark.svg
export default function CheckmarkIcon({ style, color }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Svg style={styles.flex} viewBox="0 0 512 512">
        <Path
          fill={Color.rgbaObjectToRgbaString(color)}
          d="M362.6 192.9L345 174.8c-.7-.8-1.8-1.2-2.8-1.2-1.1 0-2.1.4-2.8 1.2l-122 122.9-44.4-44.4c-.8-.8-1.8-1.2-2.8-1.2-1 0-2 .4-2.8 1.2l-17.8 17.8c-1.6 1.6-1.6 4.1 0 5.7l56 56c3.6 3.6 8 5.7 11.7 5.7 5.3 0 9.9-3.9 11.6-5.5h.1l133.7-134.4c1.4-1.7 1.4-4.2-.1-5.7z"
        />
      </Svg>
    </View>
  );
}
