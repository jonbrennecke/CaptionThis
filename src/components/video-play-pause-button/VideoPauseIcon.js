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

// SVG copied from https://fontawesome.com/icons/pause?style=solid
export default function VideoPauseIcon({ style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Svg style={styles.flex} viewBox="0 0 448 512">
        <Path
          fill="#ffffff"
          d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"
        />
      </Svg>
    </View>
  );
}
