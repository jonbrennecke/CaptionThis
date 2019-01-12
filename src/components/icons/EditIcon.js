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

// SVG copied from https://ant.design/components/icon/
export default function EditIcon({ style, color }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Svg style={styles.flex} viewBox="0 0 1024 1024">
        <Path
          fill={Color.rgbaObjectToRgbaString(color)}
          d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"
        />
      </Svg>
    </View>
  );
}
