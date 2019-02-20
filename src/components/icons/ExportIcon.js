// @flow
import React from 'react';
import { View, Image } from 'react-native';

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

export default function ExportIcon({ style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Image source={{ uri: 'ExportIcon' }} style={styles.flex} />
    </View>
  );
}
