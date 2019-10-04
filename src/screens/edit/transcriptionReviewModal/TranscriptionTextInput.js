// @flow
import React from 'react';
import { View, TextInput, Text } from 'react-native';

import * as Fonts from '../../../utils/Fonts';

import type { SFC, SpeechTranscriptionSegment, Style } from '../../../types';

export type TranscriptionTextInputProps = {
  style?: ?Style,
  segments: ?Array<SpeechTranscriptionSegment>,
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
};

// eslint-disable-next-line flowtype/generic-spacing
export const TranscriptionTextInput: SFC<TranscriptionTextInputProps> = ({
  style,
  segments,
}: TranscriptionTextInputProps) => (
  <View style={[styles.container, style]}>
    <TextInput
      style={styles.textInput}
      multiline
      autoFocus
      autoCapitalize="none"
      returnKeyType="done"
      onChangeText={value => {
        // TODO
        // this.props.onEditSegment({
        //   ...this.props.segment,
        //   substring: value,
        // });
      }}
    >
      {segments
        ? segments.map((segment, index) => (
            <Text key={`${segment.duration}-${index}`}>
              {segment.substring}
            </Text>
          ))
        : null}
    </TextInput>
  </View>
);
