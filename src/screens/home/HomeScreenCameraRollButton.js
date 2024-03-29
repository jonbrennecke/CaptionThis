// @flow
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Thumbnail } from '@jonbrennecke/react-native-media';
import MaskedView from '@react-native-community/masked-view';

import { UI_COLORS } from '../../constants';

import type { Style } from '../../types/react';
import type { VideoAssetIdentifier } from '../../types/media';

type Props = {
  style?: ?Style,
  onPress: () => void,
  id: ?VideoAssetIdentifier,
};

const styles = {
  container: {
    backgroundColor: UI_COLORS.DARK_GREY,
    borderRadius: 5,
    shadowColor: UI_COLORS.BLACK,
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowRadius: 5,
  },
  buttonInside: {
    flex: 1,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: UI_COLORS.MEDIUM_GREEN,
  },
  flex: {
    flex: 1,
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 5,
    borderWidth: 2.5,
    borderColor: UI_COLORS.WHITE,
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};

export default function HomeScreenCameraRollButton({
  style,
  onPress,
  id,
}: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <View style={styles.buttonInside}>
        {id && <Thumbnail style={styles.flex} assetID={id} />}
      </View>
      <MaskedView
        style={styles.absoluteFill}
        maskElement={<View style={styles.border} />}
      >
        <View style={styles.border} />
      </MaskedView>
    </TouchableOpacity>
  );
}
