// @flow
import React from 'react';
import { View, TouchableOpacity } from 'react-native';

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
  onDidSelectTextAlignmentMode: TextAlignmentMode => void,
};

const styles = {
  container: {
    paddingVertical: 14,
    flexDirection: 'row',
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
  item: {

  },
  icon: {
    height: 35,
    width: 35,
  },
};

export default function RichTextAlignmentControl({
  style,
  onDidSelectTextAlignmentMode,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      {USER_TEXT_ALIGNMENT_CHOICES.map(alignmentMode => {
        const IconComponent = getIconComponent(alignmentMode);
        return (
          <TouchableOpacity
            key={alignmentMode}
            style={styles.itemWrap}
            onPress={() => onDidSelectTextAlignmentMode(alignmentMode)}
          >
            <View style={styles.item}>
              {/* TODO color should be WHITE if selected, OFF_WHITE otherwise */}
              <IconComponent style={styles.icon} color={Color.hexToRgbaObject(UI_COLORS.OFF_WHITE)} />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function getIconComponent(
  alignmentMode: TextAlignmentMode
): typeof TextAlignLeftIcon | typeof TextAlignRightIcon | typeof TextAlignCenterIcon {
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
