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

export default function EditCaptionsIcon({ style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Image source={{ uri: 'EditCaptionsIcon' }} style={styles.flex} />
    </View>
  );
}
