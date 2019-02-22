// @flow
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { UI_COLORS } from '../../constants';
import FlagView from './FlagView';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  countryCode: ?string,
  onPress: () => void,
};

const styles = {
  currentLocaleFlagWrap: {
    backgroundColor: 'transparent',
    height: 25,
    width: 25,
    borderRadius: 12.5,
    borderWidth: 2,
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
    borderRadius: 12.5,
  },
  fill: StyleSheet.absoluteFillObject,
};

export default function FlagButton({ style, countryCode, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.currentLocaleFlagWrap, style]}
      onPress={onPress}
    >
      <View style={styles.currentLocaleFlag}>
        {countryCode && (
          <FlagView countryCode={countryCode} style={styles.fill} />
        )}
      </View>
    </TouchableOpacity>
  );
}
