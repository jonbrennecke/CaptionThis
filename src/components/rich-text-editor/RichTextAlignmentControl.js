// @flow
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import * as Color from '../../utils/Color';
import * as Fonts from '../../utils/Fonts';
import { USER_TEXT_ALIGNMENT_CHOICES, UI_COLORS } from '../../constants';
import TextAlignRightIcon from '../icons/TextAlignRightIcon';
import TextAlignLeftIcon from '../icons/TextAlignLeftIcon';
import TextAlignCenterIcon from '../icons/TextAlignCenterIcon';

import type { Style } from '../../types/react';
import type { TextAlignmentMode } from '../../types/video';

type Props = {
  style?: ?Style,
  alignmentMode: TextAlignmentMode,
  onDidSelectTextAlignmentMode: TextAlignmentMode => void,
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
  row: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  itemWrap: {
    paddingLeft: 15,
    paddingVertical: 12,
  },
  item: {},
  icon: {
    height: 35,
    width: 35,
  },
};

export default function RichTextAlignmentControl({
  style,
  alignmentMode,
  onDidSelectTextAlignmentMode,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text numberOfLines={1} style={styles.labelText}>
        {'Alignment'}
      </Text>
      <View style={styles.row}>
        {USER_TEXT_ALIGNMENT_CHOICES.map(mode => {
          const IconComponent = getIconComponent(mode);
          const isSelected = mode === alignmentMode;
          return (
            <TouchableOpacity
              key={mode}
              style={styles.itemWrap}
              onPress={() => onDidSelectTextAlignmentMode(mode)}
            >
              <View style={styles.item}>
                <IconComponent
                  style={styles.icon}
                  color={
                    isSelected
                      ? Color.hexToRgbaObject(UI_COLORS.WHITE)
                      : Color.hexToRgbaObject(UI_COLORS.LIGHT_GREY)
                  }
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// eslint-disable-next-line flowtype/space-after-type-colon
function getIconComponent(
  alignmentMode: TextAlignmentMode
):
  | typeof TextAlignLeftIcon
  | typeof TextAlignRightIcon
  | typeof TextAlignCenterIcon {
  switch (alignmentMode) {
    case 'left':
      return TextAlignLeftIcon;
    case 'right':
      return TextAlignRightIcon;
    case 'center':
      return TextAlignCenterIcon;
    default:
      return TextAlignCenterIcon;
  }
}
