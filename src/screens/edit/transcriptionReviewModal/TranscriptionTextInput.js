// @flow
import React from 'react';
import { View, TextInput, Text } from 'react-native';

import * as Fonts from '../../../utils/Fonts';
import { Colors } from '../../../constants';
import {
  isSegmentSelected,
  findSegmentsInSelectedTextRange,
  transformSegmentsByTextDiff,
} from './transcriptionReviewUtils';

import type { SpeechTranscriptionSegment } from '@jonbrennecke/react-native-speech';
import type { SFC, Style } from '../../../types';

export type TranscriptionTextInputProps = {
  style?: ?Style,
  textHighlightColor: $Values<typeof Colors.solid>,
  speechTranscriptionSegments: ?Array<SpeechTranscriptionSegment>,
  speechTranscriptionSegmentSelection: ?{
    startIndex: number,
    endIndex: number,
  },
  onSelectionChange: (?{ startIndex: number, endIndex: number }) => void,
  onSpeechTranscriptionSegmentsChange: (
    ?Array<SpeechTranscriptionSegment>
  ) => void,
};

const styles = {
  container: {
    flex: 1,
  },
  textInput: {
    ...Fonts.getFontStyle('formInput', {
      contentStyle: 'darkContent',
    }),
    textAlign: 'left',
    flex: 1,
    flexGrow: 1,
  },
  text: (
    isSelected: boolean,
    backgroundColor: $Values<typeof Colors.solid>
  ) => ({
    backgroundColor: isSelected ? backgroundColor : null,
    ...Fonts.getFontStyle('formInput', {
      contentStyle: isSelected ? 'lightContent' : 'darkContent',
    }),
  }),
};

// eslint-disable-next-line flowtype/generic-spacing
export const TranscriptionTextInput: SFC<TranscriptionTextInputProps> = ({
  style,
  textHighlightColor,
  speechTranscriptionSegments: segments,
  speechTranscriptionSegmentSelection: segmentSelection,
  onSelectionChange,
  onSpeechTranscriptionSegmentsChange,
}: TranscriptionTextInputProps) => (
  <View style={[styles.container, style]}>
    <TextInput
      style={styles.textInput}
      multiline
      scrollEnabled={false}
      autoCapitalize="none"
      returnKeyType="done"
      onChangeText={(text: string) => {
        if (!segments) {
          return onSpeechTranscriptionSegmentsChange(null);
        }
        const updatedSegments = transformSegmentsByTextDiff(text, segments);
        onSpeechTranscriptionSegmentsChange(updatedSegments);
      }}
      onSelectionChange={event => {
        if (!event.nativeEvent || !event.nativeEvent.selection) {
          return onSelectionChange(null);
        }
        const { selection } = event.nativeEvent;
        if (!segments) {
          return onSelectionChange(null);
        }
        onSelectionChange(findSegmentsInSelectedTextRange(segments, selection));
      }}
    >
      {segments
        ? segments.map((segment, index) => (
            <Text
              key={`${segment.timestamp}-${index}`}
              style={styles.text(
                isSegmentSelected(segment, index, segmentSelection),
                textHighlightColor
              )}
            >
              {segment.substring}
            </Text>
          ))
        : null}
    </TextInput>
  </View>
);
