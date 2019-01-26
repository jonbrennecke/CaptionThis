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
import VideoCaptionsView from '../../components/video-captions-view/VideoCaptionsView';
import Button from '../button/Button';
import { UI_COLORS } from '../../constants';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';
import type { SpeechTranscription } from '../../types/speech';
import type { LineStyle } from '../../types/video';

type Props = {
  style?: ?Style,
  playbackTime: number,
  hasFinalTranscription: boolean,
  isVisible: boolean,
  fontSize: number,
  fontFamily: string,
  textColor: ColorRGBA,
  backgroundColor: ColorRGBA,
  speechTranscription: ?SpeechTranscription,
  duration: number,
  lineStyle: LineStyle,
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
  lineStyle: LineStyle,
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
    backgroundColor: UI_COLORS.DARK_GREY,
  },
  button: {
    marginHorizontal: 10,
    marginTop: 7,
    backgroundColor: UI_COLORS.MEDIUM_GREY,
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
  transcription: {},
};

// $FlowFixMe
@autobind
export default class RichTextEditor extends Component<Props, State> {
  colorPickerAnim: Animated.Value = new Animated.Value(0);
  mainContentsAnim: Animated.Value = new Animated.Value(0);
  captionsView: ?VideoCaptionsView;

  constructor(props: Props) {
    super(props);
    this.state = {
      isColorPickerVisible: false,
      textColor: props.textColor,
      backgroundColor: props.backgroundColor,
      fontFamily: props.fontFamily,
      fontSize: props.fontSize,
      lineStyle: props.lineStyle,
    };
  }

  componentDidMount() {
    if (this.props.hasFinalTranscription && this.captionsView) {
      this.captionsView.restart();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.isVisible &&
      !prevProps.isVisible &&
      this.props.hasFinalTranscription
    ) {
      this.seekCaptionsToTime(this.props.playbackTime);
    }
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
    this.seekCaptionsToTime(this.props.playbackTime);
  }

  colorPickerDidUpdateBackgroundColor(backgroundColor: ColorRGBA) {
    this.setState({
      backgroundColor,
    });
    this.seekCaptionsToTime(this.props.playbackTime);
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

  fontFamilyListDidSelectFontFamily(fontFamily: string) {
    this.setState({
      fontFamily,
    });
    this.seekCaptionsToTime(this.props.playbackTime);
  }

  fontSizeControlDidSelectFontSize(fontSize: number) {
    this.setState({
      fontSize,
    });
    this.seekCaptionsToTime(this.props.playbackTime);
  }

  save() {
    this.props.onRequestSave({
      fontSize: this.state.fontSize,
      fontFamily: this.state.fontFamily,
      textColor: this.state.textColor,
      backgroundColor: this.state.backgroundColor,
    });
  }

  restartCaptions() {
    if (this.captionsView) {
      this.captionsView.restart();
    }
  }

  pauseCaptions() {
    if (this.captionsView) {
      this.captionsView.pause();
    }
  }

  seekCaptionsToTime(time: number) {
    if (!this.captionsView) {
      return;
    }
    this.captionsView.seekToTime(time);
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <VideoCaptionsView
          ref={ref => {
            this.captionsView = ref;
          }}
          hasFinalTranscription={this.props.hasFinalTranscription}
          style={styles.transcription}
          duration={this.props.duration}
          textColor={this.state.textColor}
          backgroundColor={this.state.backgroundColor}
          fontFamily={this.state.fontFamily}
          fontSize={this.state.fontSize}
          speechTranscription={this.props.speechTranscription}
          lineStyle={this.state.lineStyle}
        />
        <View style={styles.mainContents}>
          <View style={styles.mainContentsBackground} />
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
          <Button style={styles.button} text="Done" onPress={this.save} />
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
