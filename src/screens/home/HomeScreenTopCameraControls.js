// @flow
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { UI_COLORS } from '../../constants';
import FlagView from '../../components/localization/FlagView';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  countryCode: ?string,
  onRequestOpenLocaleMenu: () => void,
};

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  flag: {},
  currentLocaleFlagWrap: {
    backgroundColor: 'transparent',
    height: 35,
    width: 35,
    borderRadius: 17.5,
    borderWidth: 3,
    borderColor: UI_COLORS.WHITE,
    shadowOpacity: 1,
    shadowColor: UI_COLORS.DARK_GREY,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 2,
  },
  currentLocaleFlag: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 17.5,
  },
  fill: StyleSheet.absoluteFillObject,
};

export default function HomeScreenTopCameraControls({
  style,
  countryCode,
  onRequestOpenLocaleMenu,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.currentLocaleFlagWrap}
        onPress={onRequestOpenLocaleMenu}
      >
        <View style={styles.currentLocaleFlag}>
          {countryCode && (
            <FlagView countryCode={countryCode} style={styles.fill} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
