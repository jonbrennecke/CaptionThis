// @flow
import React from 'react';
import { View } from 'react-native';
// eslint-disable-next-line import/no-named-as-default
import Svg, { Path } from 'react-native-svg';

import type { SFC, Style, Children } from '../../types';

export type IconProps = {
  style?: ?Style,
  color: string,
};

const styles = {
  flex: {
    flex: 1,
  },
};

export const createIcon = ({
  data,
  viewBox = '0 0 512 512',
}: {
  viewBox?: string,
  data: string,
}): SFC<IconProps> =>
  // eslint-disable-next-line react/display-name
  ({ style, color }: IconProps) => (
    <View style={style}>
      <Svg style={styles.flex} viewBox={viewBox}>
        <Path fill={color} d={data} />
      </Svg>
    </View>
  );

export const createIconWithChildren = ({
  renderChildren,
  viewBox = '0 0 512 512',
}: {
  viewBox?: string,
  renderChildren: ({ color: string }) => Children,
}): SFC<IconProps> =>
  // eslint-disable-next-line react/display-name
  ({ style, color }: IconProps) => (
    <View style={style}>
      <Svg style={styles.flex} viewBox={viewBox}>
        {renderChildren({ color })}
      </Svg>
    </View>
  );
