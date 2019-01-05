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
  onDidSelectFontFamily: string => void,
  onRequestHide: () => void,
};

const styles = {
  container: {},
  header: {
    height: 35,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
};

export default function RichTextEditorFontFamilyList({
  style,
  onDidSelectFontFamily,
  onRequestHide,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
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
        <FontFamilyList onDidSelectFontFamily={onDidSelectFontFamily} />
      </ScrollView>
    </View>
  );
}
