// @flow
import React, { PureComponent } from 'react';
import { View, Animated, StyleSheet, Easing, Dimensions } from 'react-native';
import { autobind } from 'core-decorators';
import throttle from 'lodash/throttle';

import * as Debug from '../../utils/Debug';
import * as Fonts from '../../utils/Fonts';
import RichTextFontColorControl from './RichTextFontColorControl';
import RichTextFontFamilyControl from './RichTextFontFamilyControl';
import RichTextBackgroundColorControl from './RichTextBackgroundColorControl';
import RichTextFontSizeControl from './RichTextFontSizeControl';
import RichTextEditorColorPicker from './RichTextEditorColorPicker';
import VideoCaptionsView from '../../components/video-captions-view/VideoCaptionsView';
import Button from '../button/Button';
import { UI_COLORS } from '../../constants';

import type { SpeechTranscription } from '@jonbrennecke/react-native-speech';

import type { Style, ColorRGBA } from '../../types';
import type { CaptionStyleObject } from '../../types/video';

type Props = {
  style?: ?Style,
  isVisible: boolean,
  captionStyle: CaptionStyleObject,
  speechTranscription: ?SpeechTranscription,
  duration: number,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = {
  container: {},
  flex: {
    flex: 1,
  },
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
  buttonText: Fonts.getFontStyle('button', { contentStyle: 'lightContent' }),
  colorPickerWrap: (anim: Animated.Value) => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: UI_COLORS.DARK_GREY,
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
};

// $FlowFixMe
@autobind
export default class RichTextEditor extends PureComponent<Props, State> {
  colorPickerAnim: Animated.Value = new Animated.Value(0);
  mainContentsAnim: Animated.Value = new Animated.Value(0);
  captionsView: ?VideoCaptionsView;

  constructor(props: Props) {
    super(props);
    this.state = {
      isColorPickerVisible: false,
      textColor: props.captionStyle.textColor,
      backgroundColor: props.captionStyle.backgroundColor,
      fontFamily: props.captionStyle.fontFamily,
      fontSize: props.captionStyle.fontSize,
    };
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
      backgroundColor: {
        ...backgroundColor,
        alpha: backgroundColor.alpha > 0.1 ? 0.8 : 0,
      },
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
      useNativeDriver: true,
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
      useNativeDriver: true,
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

  playCaptions() {
    if (this.captionsView) {
      this.captionsView.play();
    }
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
    if (this.captionsView) {
      this.captionsView.seekToTime(time);
    }
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <VideoCaptionsView
          ref={ref => {
            this.captionsView = ref;
          }}
          orientation="up"
          duration={this.props.duration}
          captionStyle={{
            ...this.props.captionStyle,
            textColor: this.state.textColor,
            backgroundColor: this.state.backgroundColor,
            fontFamily: this.state.fontFamily,
            fontSize: this.state.fontSize,
          }}
          speechTranscription={this.props.speechTranscription}
          viewLayout={{
            size: { height: 85, width: SCREEN_WIDTH },
            origin: { x: 0, y: 0 },
          }}
          backgroundHeight={85}
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
