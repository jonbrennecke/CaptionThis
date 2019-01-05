// @flow
import React from 'react';
import { View } from 'react-native';

import EditScreenRichTextButton from './EditScreenRichTextButton';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  onPressRichTextButton: () => void,
};

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    flexDirection: 'row',
    paddingHorizontal: 35,
  },
  richTextButton: {
    height: 37,
    width: 37,
  },
};

export default function EditScreenEditControls({
  style,
  onPressRichTextButton,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <EditScreenRichTextButton
        style={styles.richTextButton}
        onPress={onPressRichTextButton}
      />
    </View>
  );
}
