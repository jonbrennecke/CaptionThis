// @flow
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import chunk from 'lodash/chunk';

import * as Fonts from '../../utils/Fonts';
import * as Color from '../../utils/Color';
import { USER_COLOR_CHOICES } from '../../constants';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';

type Props = {
  style?: ?Style,
  color: ColorRGBA,
  onDidSelectColor: ColorRGBA => void,
  onDidRequestShowColorPicker: ColorRGBA => void,
};

const styles = {
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  labelText: {
    ...Fonts.getFontStyle('formLabel', { contentStyle: 'darkContent' }),
    marginBottom: 4,
  },
  backgroundColor: (color: ColorRGBA) => ({
    height: 45,
    width: 30 * 4 - 3,
    backgroundColor: Color.rgbaObjectToRgbaString(color),
    borderRadius: 6,
    borderWidth: 4,
    borderColor: isWhite(color)
      ? Color.hexToRgbaString('#dddddd', 0.5)
      : Color.hexToRgbaString(Color.rgbaObjectToRgbaString(color), 0.5),
    marginBottom: 3,
  }),
  colorInside: (color: ColorRGBA) => ({
    flex: 1,
    borderRadius: 6,
    borderWidth: 4,
    borderColor: isWhite(color)
      ? Color.hexToRgbaString('#dddddd', 0.5)
      : Color.hexToRgbaString(Color.rgbaObjectToRgbaString(color), 0.5),
  }),
  color: {
    height: 30,
    width: 30,
    padding: 3,
  },
  row: {
    flexDirection: 'row',
  },
};

function isWhite(color: ColorRGBA): boolean {
  return color.red === 255 && color.blue === 255 && color.green === 255;
}

export default function RichTextFontColorControl({
  style,
  color,
  onDidSelectColor,
  onDidRequestShowColorPicker,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text numberOfLines={1} style={styles.labelText}>
        {'Color'}
      </Text>
      <TouchableOpacity
        style={styles.row}
        onPress={onDidRequestShowColorPicker}
      >
        <View style={styles.backgroundColor(color)} />
      </TouchableOpacity>
      {chunk(USER_COLOR_CHOICES, 4).map((colors, index) => (
        <View style={styles.row} key={index}>
          {colors.map(color => (
            <TouchableOpacity
              key={color}
              style={styles.color}
              onPress={() => onDidSelectColor(Color.hexToRgbaObject(color))}
            >
              <View
                style={[
                  styles.colorInside(Color.hexToRgbaObject(color)),
                  { backgroundColor: color },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}