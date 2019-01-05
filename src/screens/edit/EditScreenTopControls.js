// @flow
import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { UI_COLORS } from '../../constants';
import * as Color from '../../utils/Color';
import * as Fonts from '../../utils/Fonts';
import ChevronLeftIcon from '../../components/chevron-left-icon/ChevronLeftIcon';
import WandIcon from '../../components/wand-icon/WandIcon';
import CheckmarkIcon from '../../components/checkmark-icon/CheckmarkIcon';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  onBackButtonPress: () => void,
  onExportButtonPress: () => void,
  onStylizeButtonPress: () => void,
};

const styles = {
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
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
  },
  checkmarkIcon: {
    height: 50,
    width: 50,
  },
  buttonLeft: {
    width: 75,
    alignItems: 'flex-start',
  },
  buttonRight: {
    width: 75,
    alignItems: 'flex-end',
  },
  buttonGroupLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  buttonGroupRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
};

export default function EditScreenTopControls({
  style,
  onBackButtonPress,
  onExportButtonPress,
  onStylizeButtonPress,
}: Props) {
  const white = Color.hexToRgbaObject(UI_COLORS.WHITE);
  return (
    <View style={[styles.container, style]}>
      <View style={styles.buttonGroupLeft}>
        <TouchableOpacity style={styles.buttonLeft} onPress={onBackButtonPress}>
          <ChevronLeftIcon style={styles.icon} color={white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonLeft} onPress={onStylizeButtonPress}>
          <WandIcon style={styles.icon} color={white} />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonGroupRight}>
        <TouchableOpacity style={styles.buttonRight} onPress={onExportButtonPress}>
          <CheckmarkIcon style={styles.checkmarkIcon} color={white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
