// @flow
import React, { Component } from 'react';
import { View, Text, TextInput, Animated } from 'react-native';
import { autobind } from 'core-decorators';

import * as Fonts from '../../utils/Fonts';
import * as Color from '../../utils/Color';
import { UI_COLORS } from '../../constants';

import type { Style } from '../../types/react';
import type { SpeechTranscriptionSegment } from '../../types/speech';

type Props = {
  style?: ?Style,
  segment: SpeechTranscriptionSegment,
  autoFocus: boolean,
  onEditSegment: (SpeechTranscriptionSegment) => void,
};

const styles = {
  container: {
    paddingVertical: 4,
    paddingHorizontal: 23,
  },
  inputWrap: (anim: Animated.Value) => ({
    flex: 1,
    marginTop: 2,
    paddingHorizontal: 7,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [
        Color.hexToRgbaString(UI_COLORS.WHITE, 0.0),
        Color.hexToRgbaString(UI_COLORS.WHITE, 0.75),
      ],
    }),
    borderRadius: 7,
    shadowOpacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.15],
    }),
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 17,
    shadowColor: UI_COLORS.DARK_GREY,
  }),
  substring: {
    ...Fonts.getFontStyle('formInput', { contentStyle: 'darkContent' }),
    textAlign: 'left',
    flex: 1,
  },
  timestamp: {
    ...Fonts.getFontStyle('formLabel', { contentStyle: 'darkContent' }),
    paddingHorizontal: 7,
  },
};

// $FlowFixMe
@autobind
export default class SpeechTranscriptionSegmentInput extends Component<Props> {
  anim: Animated.Value = new Animated.Value(0);

  textInputDidFocus() {
    Animated.timing(this.anim, {
      toValue: 1,
      duration: 200,
    }).start();
  }

  textInputDidBlur() {
    Animated.timing(this.anim, {
      toValue: 0,
      duration: 200,
    }).start();
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Text style={styles.timestamp}>
          {formatTimestamp(this.props.segment.timestamp)}
        </Text>
        <Animated.View style={styles.inputWrap(this.anim)}>
          <TextInput
            style={styles.substring}
            value={this.props.segment.substring}
            autoFocus={this.props.autoFocus}
            onFocus={this.textInputDidFocus}
            onBlur={this.textInputDidBlur}
            onChangeText={value => {
              this.props.onEditSegment({
                ...this.props.segment,
                substring: value,
              });
            }}
          />
        </Animated.View>
      </View>
    );
  }
}

function formatTimestamp(timestamp: number): string {
  return `${timestamp.toFixed(2)}s`;
}
