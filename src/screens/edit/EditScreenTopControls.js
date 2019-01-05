// @flow
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { UI_COLORS } from '../../constants';
import * as Color from '../../utils/Color';
import * as Fonts from '../../utils/Fonts';
import ChevronLeftIcon from '../../components/chevron-left-icon/ChevronLeftIcon';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  onBackButtonPress: () => void,
  onExportButtonPress: () => void,
};

const styles = {
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    ...Fonts.getFontStyle('button', { contentStyle: 'lightContent' }),
    textShadowColor: Color.hexToRgbaString(UI_COLORS.DARK_GREY, 0.5),
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  icon: {
    height: 35,
    width: 35,
  }
};

export default function EditScreenTopControls({
  style,
  onBackButtonPress,
  onExportButtonPress,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={onBackButtonPress}>
        <ChevronLeftIcon style={styles.icon} color={Color.hexToRgbaObject(UI_COLORS.WHITE)}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={onExportButtonPress}>
        <Text numberOfLines={1} style={styles.buttonText}>
          {'EXPORT >'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
