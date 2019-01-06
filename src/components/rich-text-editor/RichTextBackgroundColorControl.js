// @flow
import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';

import * as Fonts from '../../utils/Fonts';
import * as Color from '../../utils/Color';
import { USER_COLOR_CHOICES } from '../../constants';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';

type Props = {
  style?: ?Style,
  onDidSelectColor: ColorRGBA => void,
};

const styles = {
  container: {
    paddingVertical: 10,
  },
  labelText: {
    ...Fonts.getFontStyle('formLabel', { contentStyle: 'darkContent' }),
    marginBottom: 7,
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  color: {
    paddingVertical: 12,
    alignItems: 'flex-start',
    paddingLeft: 15,
    paddingRight: 3,
  },
  colorInside: (color: ColorRGBA) => ({
    flex: 1,
    height: 35,
    width: 35,
    borderRadius: 17.5,
    borderWidth: 4,
    borderColor: isWhite(color)
      ? Color.hexToRgbaString('#dddddd', 0.5)
      : Color.hexToRgbaString(Color.rgbaObjectToRgbaString(color), 0.5),
  }),
};

function isWhite(color: ColorRGBA): boolean {
  return color.red === 255 && color.blue === 255 && color.green === 255;
}

export default function RichTextBackgroundColorControl({
  style,
  onDidSelectColor,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text numberOfLines={1} style={styles.labelText}>
        {'Background'}
      </Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        overScrollMode="always"
      >
        <View style={styles.row}>
          {USER_COLOR_CHOICES.map(color => (
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
      </ScrollView>
    </View>
  );
}
