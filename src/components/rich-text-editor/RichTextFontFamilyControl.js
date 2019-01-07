// @flow
import React from 'react';
import { View, ScrollView, Text } from 'react-native';

import * as Fonts from '../../utils/Fonts';
import FontFamilyList from '../font-family-list/FontFamilyList';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  fontFamily: string,
  onDidSelectFontFamily: string => void,
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
  buttonText: Fonts.getFontStyle('heading', {
    contentStyle: 'darkContent',
  }),
};

export default function RichTextFontFamilyControl({
  style,
  fontFamily,
  onDidSelectFontFamily,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text numberOfLines={1} style={styles.labelText}>
        {'Font'}
      </Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        overScrollMode="always"
      >
        <FontFamilyList
          fontFamily={fontFamily}
          onDidSelectFontFamily={onDidSelectFontFamily}
        />
      </ScrollView>
    </View>
  );
}
