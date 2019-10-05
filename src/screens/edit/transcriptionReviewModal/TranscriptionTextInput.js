// @flow
import React from 'react';
import { View, TextInput, Text } from 'react-native';
import first from 'lodash/first';
import last from 'lodash/last';

import * as Fonts from '../../../utils/Fonts';
import { Units } from '../../../constants';

import type { SFC, SpeechTranscriptionSegment, Style } from '../../../types';

export type TranscriptionTextInputProps = {
  style?: ?Style,
  speechTranscriptionSegments: ?Array<SpeechTranscriptionSegment>,
  speechTranscriptionSegmentSelection: ?{
    startIndex: number,
    endIndex: number,
  },
  onSelectionChange: (?{ startIndex: number, endIndex: number }) => void,
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
  text: (isSelected: boolean) => ({
    backgroundColor: isSelected ? 'blue' : null,
    ...Fonts.getFontStyle('formInput', {
      contentStyle: isSelected ? 'lightContent' : 'darkContent',
    }),
  }),
};

// eslint-disable-next-line flowtype/generic-spacing
export const TranscriptionTextInput: SFC<TranscriptionTextInputProps> = ({
  style,
  speechTranscriptionSegments: segments,
  speechTranscriptionSegmentSelection: segmentSelection,
  onSelectionChange,
}: TranscriptionTextInputProps) => (
  <View style={[styles.container, style]}>
    <TextInput
      style={styles.textInput}
      multiline
      autoFocus
      autoCapitalize="none"
      returnKeyType="done"
      onChangeText={value => {
        console.log('onChangeText', value);
        // TODO
        // this.props.onEditSegment({
        //   ...this.props.segment,
        //   substring: value,
        // });
      }}
      onSelectionChange={event => {
        if (!event.nativeEvent || !event.nativeEvent.selection) {
          return onSelectionChange(null);
        }
        const { selection } = event.nativeEvent;
        if (!segments) {
          return onSelectionChange(null);
        }
        onSelectionChange(findSegmentsInSelection(segments, selection));
      }}
    >
      {segments
        ? segments.map((segment, index) => (
            <Text
              key={`${segment.duration}-${index}`}
              style={styles.text(
                segmentSelection
                  ? index >= segmentSelection.startIndex &&
                    index <= segmentSelection.endIndex
                  : false
              )}
            >
              {segment.substring}
            </Text>
          ))
        : null}
    </TextInput>
  </View>
);

function findSegmentsInSelection(
  segments: Array<SpeechTranscriptionSegment>,
  selection: { start: number, end: number }
) {
  let formattedStringCharLength = 0;
  const segmentPositions = segments.map((segment, index) => {
    const firstCharIndex = formattedStringCharLength;
    const lastCharIndex = firstCharIndex + segment.substring.length;
    formattedStringCharLength = lastCharIndex;
    return {
      segment,
      index,
      lastCharIndex,
      firstCharIndex,
    };
  });
  const selectedSegments = segmentPositions.filter(
    ({ firstCharIndex, lastCharIndex }) => {
      const selectionIsInsideSegment =
        selection.start >= firstCharIndex && selection.end < lastCharIndex;
      const selectionContainsSegment =
        selection.start <= firstCharIndex && selection.end >= lastCharIndex;
      const multiwordSelectionBeginsInsideSegment =
        selection.start >= firstCharIndex &&
        selection.start < lastCharIndex &&
        selection.end >= selection.start;
      const multiwordSelectionEndsInsideSegment =
        selection.end > firstCharIndex &&
        selection.end < lastCharIndex &&
        selection.start <= firstCharIndex;
      return (
        selectionIsInsideSegment ||
        selectionContainsSegment ||
        multiwordSelectionBeginsInsideSegment ||
        multiwordSelectionEndsInsideSegment
      );
    }
  );
  const firstSelectedSegment = first(selectedSegments);
  const lastSelectedSegment = last(selectedSegments);
  return selectedSegments.length
    ? {
        startIndex: firstSelectedSegment.index,
        endIndex: lastSelectedSegment.index,
      }
    : null;
}
