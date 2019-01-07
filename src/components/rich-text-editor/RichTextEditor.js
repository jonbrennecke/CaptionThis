// @flow
import React, { Component } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { autobind } from 'core-decorators';
import throttle from 'lodash/throttle';

import * as Fonts from '../../utils/Fonts';
import RichTextFontColorControl from './RichTextFontColorControl';
import RichTextFontFamilyControl from './RichTextFontFamilyControl';
import RichTextBackgroundColorControl from './RichTextBackgroundColorControl';
import RichTextFontSizeControl from './RichTextFontSizeControl';
import RichTextEditorColorPicker from './RichTextEditorColorPicker';
import RecordingTranscriptionView from '../../components/recording-transcription-view/RecordingTranscriptionView';
import Button from '../button/Button';
import { UI_COLORS } from '../../constants';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';
import type { SpeechTranscription } from '../../types/speech';

type Props = {
  style?: ?Style,
  isVisible: boolean,
  fontSize: number,
  fontFamily: string,
  textColor: ColorRGBA,
  backgroundColor: ColorRGBA,
  speechTranscription: ?SpeechTranscription,
  onRequestLockScroll?: () => void,
  onRequestUnlockScroll?: () => void,
  onRequestSave: ({
    fontSize: number,
    fontFamily: string,
    textColor: ColorRGBA,
    backgroundColor: ColorRGBA,
  }) => void,
};

type State = {
  isColorPickerVisible: boolean,
  textColor: ColorRGBA,
  backgroundColor: ColorRGBA,
  fontFamily: string,
  fontSize: number,
};

const styles = {
  container: {},
  flex: {
    flex: 1,
  },
  buttonText: Fonts.getFontStyle('button', { contentStyle: 'lightContent' }),
  field: {
    paddingVertical: 2,
  },
  mainContents: {
    justifyContent: 'space-between',
    paddingBottom: 13,
    paddingTop: 10,
  },
  mainContentsBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -200,
    backgroundColor: UI_COLORS.BLACK,
  },
  button: {
    marginHorizontal: 10,
    marginTop: 7,
  },
  colorPickerWrap: (anim: Animated.Value) => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: UI_COLORS.BLACK,
    justifyContent: 'space-between',
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [200, 0],
        }),
      },
    ],
  }),
  transcription: {}
};

// $FlowFixMe
@autobind
export default class RichTextEditor extends Component<Props, State> {
  colorPickerAnim: Animated.Value = new Animated.Value(0);
  mainContentsAnim: Animated.Value = new Animated.Value(0);

  constructor(props: Props) {
    super(props);
    this.state = {
      isColorPickerVisible: false,
      textColor: props.textColor,
      backgroundColor: props.backgroundColor,
      fontFamily: props.fontFamily,
      fontSize: props.fontSize,
    };
  }

  fontFamilyListDidSelectFontFamily(fontFamily: string) {
    this.setState({
      fontFamily,
    });
  }

  colorPickerDidUpdateColorThrottled = throttle(
    this.colorPickerDidUpdateColor,
    100,
    { leading: true }
  );

  colorPickerDidUpdateColor(color: ColorRGBA) {
    this.colorPickerDidUpdateBackgroundColor(color);
  }

  colorPickerDidUpdateTextColor(textColor: ColorRGBA) {
    this.setState({
      textColor,
    });
  }

  colorPickerDidUpdateBackgroundColor(backgroundColor: ColorRGBA) {
    this.setState({
      backgroundColor,
    });
  }

  showColorPicker() {
    this.setState({
      isColorPickerVisible: true,
    });
    this.animateInColorPicker();
  }

  hideColorPicker() {
    this.setState({
      isColorPickerVisible: false,
    });
    this.animateOutColorPicker();
  }

  animateInColorPicker() {
    const config = {
      toValue: 1,
      duration: 200,
      easing: Easing.quad,
    };
    Animated.parallel([
      Animated.timing(this.colorPickerAnim, config),
      Animated.timing(this.mainContentsAnim, config),
    ]).start();
  }

  animateOutColorPicker() {
    const config = {
      toValue: 0,
      duration: 200,
      easing: Easing.quad,
    };
    Animated.parallel([
      Animated.timing(this.colorPickerAnim, config),
      Animated.timing(this.mainContentsAnim, config),
    ]).start();
  }

  fontSizeControlDidSelectFontSize(fontSize: number) {
    this.setState({
      fontSize,
    });
  }

  save() {
    this.props.onRequestSave({
      fontSize: this.state.fontSize,
      fontFamily: this.state.fontFamily,
      textColor: this.state.textColor,
      backgroundColor: this.state.backgroundColor,
    });
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <RecordingTranscriptionView
          style={styles.transcription}
          textColor={this.state.textColor}
          backgroundColor={this.state.backgroundColor}
          fontFamily={this.state.fontFamily}
          speechTranscription={this.props.speechTranscription}
        />
        <View style={styles.mainContents}>
          <View style={styles.mainContentsBackground}/>
          <RichTextFontFamilyControl
            style={styles.field}
            fontFamily={this.state.fontFamily}
            onDidSelectFontFamily={this.fontFamilyListDidSelectFontFamily}
          />
          <RichTextFontSizeControl
            fontSize={this.state.fontSize}
            style={styles.field}
            onDidSelectFontSize={this.fontSizeControlDidSelectFontSize}
          />
          <RichTextFontColorControl
            style={styles.field}
            onDidSelectColor={this.colorPickerDidUpdateTextColor}
          />
          <RichTextBackgroundColorControl
            style={styles.field}
            onDidSelectColor={this.colorPickerDidUpdateBackgroundColor}
            onRequestShowColorPicker={this.showColorPicker}
          />
          <Button style={styles.button} text="Save" onPress={this.save} />
          <Animated.View
            style={styles.colorPickerWrap(this.colorPickerAnim)}
            pointerEvents={this.state.isColorPickerVisible ? 'auto' : 'none'}
          >
            <RichTextEditorColorPicker
              color={this.state.backgroundColor}
              onRequestHide={this.hideColorPicker}
              onDidUpdateColor={this.colorPickerDidUpdateColorThrottled}
            />
          </Animated.View>
        </View>
      </View>
    );
  }
}
