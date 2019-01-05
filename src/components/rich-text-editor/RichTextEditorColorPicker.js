// @flow
import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { UI_COLORS } from '../../constants';
import * as Color from '../../utils/Color';
import ChevronUpIcon from '../chevron-up-icon/ChevronUpIcon';
import ColorPicker from '../color-picker/ColorPicker';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';

type Props = {
  style?: ?Style,
  color: ColorRGBA,
  onRequestHide: () => void,
  onDidUpdateColor: ColorRGBA => void,
};

const styles = {
  container: {},
  header: {
    height: 25,
  },
  flex: {
    flex: 1,
  },
  colorPicker: {
    flex: 1,
    justifyContent: 'center',
  },
};

export default function RichTextEditorColorPicker({
  style,
  color,
  onRequestHide,
  onDidUpdateColor,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.flex} onPress={onRequestHide}>
          <ChevronUpIcon
            color={Color.hexToRgbaObject(UI_COLORS.LIGHT_GREY)}
            style={styles.flex}
          />
        </TouchableOpacity>
      </View>
      <ColorPicker
        style={styles.colorPicker}
        color={color}
        onDidUpdateColor={onDidUpdateColor}
      />
    </View>
  );
}
