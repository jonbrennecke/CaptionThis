// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view';

import * as Color from '../../utils/Color';
import { UI_COLORS } from '../../constants';
import CaptionPresetStylesPicker from '../../components/caption-preset-styles-picker/CaptionPresetStylesPicker';

import type { Style } from '../../types/react';
import type { CaptionStyleObject } from '../../types/video';

type CaptionStyleObjectWithId = {|
  ...CaptionStyleObject,
  id: string,
|};

type Props = {
  style?: ?Style,
  isVisible: boolean,
  currentPreset: CaptionStyleObjectWithId,
  presets: CaptionStyleObjectWithId[],
  onRequestSelectPreset: CaptionStyleObjectWithId => void,
};

const styles = {
  container: {
    paddingTop: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  presets: {
    flex: 1,
  },
  leftGradient: StyleSheet.absoluteFillObject,
  rightGradient: StyleSheet.absoluteFillObject,
  flex: {
    flex: 1,
  },
};

export default function HomeScreenPresetStyles({
  style,
  currentPreset,
  presets,
  onRequestSelectPreset,
}: Props) {
  const colorHex = UI_COLORS.BLACK;
  return (
    <View style={[styles.container, style]}>
      <MaskedView
        pointerEvents="box-none"
        style={styles.flex}
        maskElement={
          <LinearGradient
            pointerEvents="none"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={[
              Color.hexToRgbaString(colorHex, 0),
              Color.hexToRgbaString(colorHex, 1),
              Color.hexToRgbaString(colorHex, 1),
              Color.hexToRgbaString(colorHex, 0),
            ]}
            locations={[0, 0.1, 0.9, 1]}
            style={styles.leftGradient}
          />
        }
      >
        <CaptionPresetStylesPicker
          style={styles.presets}
          presets={presets}
          currentPreset={currentPreset}
          onRequestSelectPreset={onRequestSelectPreset}
        />
      </MaskedView>
    </View>
  );
}
