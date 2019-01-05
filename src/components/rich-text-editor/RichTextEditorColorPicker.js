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
  onRequestLockScroll?: () => void,
  onRequestUnlockScroll?: () => void,
};

const styles = {
  container: {
    paddingBottom: 13,
  },
  header: {
    height: 35,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  chevron: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  colorPicker: {
    flex: 1,
    justifyContent: 'space-between',
  },
};

export default function RichTextEditorColorPicker({
  style,
  color,
  onRequestHide,
  onDidUpdateColor,
  onRequestLockScroll,
  onRequestUnlockScroll,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.flex} onPress={onRequestHide}>
          <ChevronUpIcon
            color={Color.hexToRgbaObject(UI_COLORS.LIGHT_GREY)}
            style={styles.chevron}
          />
        </TouchableOpacity>
      </View>
      <ColorPicker
        style={styles.colorPicker}
        color={color}
        onDidUpdateColor={onDidUpdateColor}
        onRequestLockScroll={onRequestLockScroll}
        onRequestUnlockScroll={onRequestUnlockScroll}
      />
    </View>
  );
}
