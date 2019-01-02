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

// SVG copied from https://ionicons.com/ionicons/svg/ios-pause.svg
export default function VideoPauseIcon({ style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Svg style={styles.flex} viewBox="0 0 512 512">
        <Path
          fill="#ffffff"
          d="M199.9 416h-63.8c-4.5 0-8.1-3.6-8.1-8V104c0-4.4 3.6-8 8.1-8h63.8c4.5 0 8.1 3.6 8.1 8v304c0 4.4-3.6 8-8.1 8zM375.9 416h-63.8c-4.5 0-8.1-3.6-8.1-8V104c0-4.4 3.6-8 8.1-8h63.8c4.5 0 8.1 3.6 8.1 8v304c0 4.4-3.6 8-8.1 8z"
        />
      </Svg>
    </View>
  );
}
