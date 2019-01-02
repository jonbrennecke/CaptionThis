// @flow
import React from 'react';
import { View } from 'react-native';
// eslint-disable-next-line import/no-named-as-default
import Svg, { Path } from 'react-native-svg';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
};

const styles = {
  container: {},
  flex: {
    flex: 1,
  },
};

// SVG copied from https://fontawesome.com/icons/play?style=solid
export default function VideoPlayIcon({ style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Svg style={styles.flex} viewBox="0 0 448 512">
        <Path
          fill="#ffffff"
          d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"
        />
      </Svg>
    </View>
  );
}
