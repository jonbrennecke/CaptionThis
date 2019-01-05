// @flow
import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';

import { UI_COLORS } from '../../constants';
import * as Color from '../../utils/Color';
import FontFamilyList from '../font-family-list/FontFamilyList';
import ChevronUpIcon from '../chevron-up-icon/ChevronUpIcon';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  onSelectFont: string => void,
  onRequestHide: () => void,
};

const styles = {
  container: {},
  fontFamilyListHeader: {
    height: 25,
  },
  flex: {
    flex: 1,
  },
};

export default function RichTextEditorFontFamilyList({
  style,
  onSelectFont,
  onRequestHide,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.fontFamilyListHeader}>
        <TouchableOpacity style={styles.flex} onPress={onRequestHide}>
          <ChevronUpIcon
            color={Color.hexToRgbaObject(UI_COLORS.LIGHT_GREY)}
            style={styles.flex}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.flex}
        showsVerticalScrollIndicator
        overScrollMode="always"
      >
        <FontFamilyList onSelectFont={onSelectFont} />
      </ScrollView>
    </View>
  );
}
