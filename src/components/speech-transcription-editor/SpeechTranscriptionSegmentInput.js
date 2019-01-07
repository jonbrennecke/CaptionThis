// @flow
import React, { Component } from 'react';
import { View, TextInput, Animated } from 'react-native';
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
  onEditSegment: SpeechTranscriptionSegment => void,
};

type State = {
  isFocused: boolean,
};

const styles = {
  container: (isFocused: boolean) => ({
    paddingVertical: 4,
    paddingRight: 7,
    zIndex: isFocused ? 10 : 0,
  }),
  inputWrap: {
    flex: 1,
  },
  inputFocusWrap: (anim: Animated.Value) => ({
    position: 'absolute',
    top: -13,
    bottom: -9,
    left: -16,
    right: -16,
    backgroundColor: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [
        Color.hexToRgbaString(UI_COLORS.WHITE, 0.0),
        Color.hexToRgbaString(UI_COLORS.WHITE, 1),
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
    flexGrow: 1,
  },
  timestamp: (anim: Animated.Value) => ({
    position: 'absolute',
    left: 0,
    top: -6,
    ...Fonts.getFontStyle('formLabel', { contentStyle: 'darkContent' }),
    fontSize: 8,
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -5],
        }),
      },
    ],
    width: 75,
  }),
};

// $FlowFixMe
@autobind
export default class SpeechTranscriptionSegmentInput extends Component<
  Props,
  State
> {
  anim: Animated.Value = new Animated.Value(0);
  state = {
    isFocused: false,
  };

  textInputDidFocus() {
    this.setState({
      isFocused: true,
    });
    Animated.timing(this.anim, {
      toValue: 1,
      duration: 200,
    }).start();
  }

  textInputDidBlur() {
    this.setState({
      isFocused: false,
    });
    Animated.timing(this.anim, {
      toValue: 0,
      duration: 200,
    }).start();
  }

  render() {
    return (
      <View style={[styles.container(this.state.isFocused), this.props.style]}>
        <View style={styles.inputWrap}>
          <Animated.View style={styles.inputFocusWrap(this.anim)} />
          <Animated.Text style={styles.timestamp(this.anim)}>
            {formatTimestamp(this.props.segment.timestamp)}
          </Animated.Text>
          <TextInput
            style={styles.substring}
            value={this.props.segment.substring}
            autoFocus={this.props.autoFocus}
            autoCapitalize="sentences"
            onFocus={this.textInputDidFocus}
            onBlur={this.textInputDidBlur}
            onChangeText={value => {
              this.props.onEditSegment({
                ...this.props.segment,
                substring: value,
              });
            }}
          />
        </View>
      </View>
    );
  }
}

function formatTimestamp(timestamp: number): string {
  return `${timestamp.toFixed(2)}s`;
}
