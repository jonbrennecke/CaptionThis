// @flow
import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';

import { UI_COLORS } from '../../constants';
import * as Color from '../../utils/Color';
import * as Fonts from '../../utils/Fonts';
import ChevronLeftIcon from '../../components/chevron-left-icon/ChevronLeftIcon';
import OptionsIcon from '../../components/icons/OptionsIcon';
import EditIcon from '../../components/icons/EditIcon';
import CheckmarkIcon from '../../components/checkmark-icon/CheckmarkIcon';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  isReadyToExport: boolean,
  onBackButtonPress: () => void,
  onExportButtonPress: () => void,
  onStylizeButtonPress: () => void,
  onEditTextButtonPress: () => void,
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
    height: 30,
    width: 30,
  },
  checkmarkIcon: {
    height: 45,
    width: 45,
  },
  buttonLeft: {
    width: 75,
    alignItems: 'flex-start',
  },
  buttonRight: (isReadyToExport: boolean) => ({
    width: 75,
    alignItems: 'flex-end',
    opacity: isReadyToExport ? 1 : 0.5,
  }),
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
  isReadyToExport,
  onBackButtonPress,
  onExportButtonPress,
  onStylizeButtonPress,
  onEditTextButtonPress,
}: Props) {
  const white = Color.hexToRgbaObject(UI_COLORS.WHITE);
  return (
    <View style={[styles.container, style]}>
      <View style={styles.buttonGroupLeft}>
        <TouchableOpacity style={styles.buttonLeft} onPress={onBackButtonPress}>
          <ChevronLeftIcon style={styles.icon} color={white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonLeft}
          onPress={onStylizeButtonPress}
        >
          <OptionsIcon style={styles.icon} color={white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonLeft}
          onPress={onEditTextButtonPress}
        >
          <EditIcon style={styles.icon} color={white} />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonGroupRight}>
        <TouchableOpacity
          disabled={!isReadyToExport}
          style={styles.buttonRight(isReadyToExport)}
          onPress={onExportButtonPress}
        >
          {isReadyToExport ? (
            <CheckmarkIcon style={styles.checkmarkIcon} color={white} />
          ) : (
            <ActivityIndicator style={styles.checkmarkIcon} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
