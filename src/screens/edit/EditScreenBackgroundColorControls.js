// @flow
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import * as Screens from '../../utils/Screens';
import * as Fonts from '../../utils/Fonts';
import * as Color from '../../utils/Color';
import { UI_COLORS, USER_EDITABLE_COLORS } from '../../constants';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';

type Props = {
  style?: ?Style,
  color: ColorRGBA,
};

const styles = {
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  labelText: {
    ...Fonts.getFontStyle('formLabel', { contentStyle: 'lightContent' }),
    marginBottom: 4,
  },
  backgroundColor: {
    backgroundColor: UI_COLORS.DARK_GREY,
    height: 45,
    borderRadius: 10,
  },
};

export default function EditScreenBackgroundColorControls({
  style,
  color,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text numberOfLines={1} style={styles.labelText}>
        {'BACKGROUND COLOR'}
      </Text>
      <TouchableOpacity
        onPress={() =>
          Screens.showColorModal(USER_EDITABLE_COLORS.BACKGROUND_COLOR)
        }
      >
        <View
          style={[
            styles.backgroundColor,
            { backgroundColor: Color.rgbaObjectToRgbaString(color) },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
}
