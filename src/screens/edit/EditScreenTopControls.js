// @flow
import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { UI_COLORS } from '../../constants';
import * as Color from '../../utils/Color';
import * as Fonts from '../../utils/Fonts';
import ChevronLeftIcon from '../../components/icons/ChevronLeftIcon';
import EditCaptionsIcon from '../../components/icons/EditCaptionsIcon';
import ColorPaletteIcon from '../../components/icons/ColorPaletteIcon';
import ExportIcon from '../../components/icons/ExportIcon';
import FlagButton from '../../components/localization/FlagButton';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  isReadyToExport: boolean,
  onBackButtonPress: () => void,
  onExportButtonPress: () => void,
  onStylizeButtonPress: () => void,
  onEditTextButtonPress: () => void,
  onLocaleButtonPress: () => void,
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
  buttonLeft: {
    width: 60,
    height: 45,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  buttonRight: {
    width: 60,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportIcon: {
    height: 30,
    width: 30,
    padding: 3,
  },
  exportButton: (isReadyToExport: boolean) => ({
    width: 60,
    alignItems: 'center',
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
  onLocaleButtonPress,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.buttonGroupLeft}>
        <TouchableOpacity style={styles.buttonLeft} onPress={onBackButtonPress}>
          <ChevronLeftIcon style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonGroupRight}>
        <View style={styles.buttonRight}>
          <FlagButton onPress={onLocaleButtonPress} countryCode="US" />
        </View>
        <TouchableOpacity
          style={styles.buttonRight}
          onPress={onStylizeButtonPress}
        >
          <ColorPaletteIcon style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonRight}
          onPress={onEditTextButtonPress}
        >
          <EditCaptionsIcon style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!isReadyToExport}
          style={styles.exportButton(isReadyToExport)}
          onPress={onExportButtonPress}
        >
          <ExportIcon style={styles.exportIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
