// @flow
import React from 'react';
import { View, Text } from 'react-native';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import * as Color from '../../utils/Color';

import type { Style } from '../../types/react';
import type { SpeechTranscription } from '../../types/speech';

type Props = {
  style: ?Style,
  fontFamily: string,
  speechTranscription: ?SpeechTranscription,
};

const TEXT_TRUNCATION_LENGTH_CHARACTERS = 70;

const styles = {
  container: {
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  text: {
    ...Fonts.getFontStyle('heading', {
      contentStyle: 'lightContent',
      size: 'large',
    }),
    textShadowColor: Color.hexToRgbaString(UI_COLORS.BLACK, 0.5),
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 2,
    textAlign: 'left',
  },
};

export default function LiveTranscriptionView({
  style,
  speechTranscription,
  fontFamily,
}: Props) {
  const text = speechTranscription?.formattedString;
  const formattedText = formatText(text);
  return (
    <View style={[styles.container, style]}>
      <Text
        style={[styles.text, { fontFamily }]}
        ellipsizeMode="head"
        numberOfLines={1}
      >
        {formattedText}
      </Text>
    </View>
  );
}

function formatText(text: ?string): string {
  if (!text) {
    return '';
  }
  if (text.length > TEXT_TRUNCATION_LENGTH_CHARACTERS) {
    const truncatedText = text.substr(
      text.length - TEXT_TRUNCATION_LENGTH_CHARACTERS,
      TEXT_TRUNCATION_LENGTH_CHARACTERS
    );
    return truncatedText;
  }
  return text;
}
