// @flow
import React, { Component } from 'react';
import { View, Animated, Dimensions, Easing } from 'react-native';
import { autobind } from 'core-decorators';
import throttle from 'lodash/throttle';

import * as Fonts from '../../utils/Fonts';
import RichTextFontColorControl from './RichTextFontColorControl';
import RichTextFontFamilyControl from './RichTextFontFamilyControl';
import RichTextBackgroundColorControl from './RichTextBackgroundColorControl';
import RichTextFontSizeControl from './RichTextFontSizeControl';
import Button from '../button/Button';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';

type EditingColor = 'textColor' | 'backgroundColor';

type Props = {
  style?: ?Style,
  isVisible: boolean,
  fontSize: number,
  fontFamily: string,
  textColor: ColorRGBA,
  backgroundColor: ColorRGBA,
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
  isFontFamilyListVisible: boolean,
  isColorPickerVisible: boolean,
  editingColor: EditingColor,
  textColor: ColorRGBA,
  backgroundColor: ColorRGBA,
  fontFamily: string,
  fontSize: number,
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = {
  container: {},
  flex: {
    flex: 1,
  },
  buttonText: Fonts.getFontStyle('button', { contentStyle: 'lightContent' }),
  buttonLabelText: Fonts.getFontStyle('formLabel', {
    contentStyle: 'lightContent',
  }),
  field: {
    paddingVertical: 2,
  },
  mainContents: {
    justifyContent: 'space-between',
    paddingBottom: 13,
    paddingTop: 8,
  },
  button: {
    marginHorizontal: 10,
  },
};

// $FlowFixMe
@autobind
export default class RichTextEditor extends Component<Props, State> {
  fontFamilyAnim: Animated.Value = new Animated.Value(0);
  colorPickerAnim: Animated.Value = new Animated.Value(0);

  constructor(props: Props) {
    super(props);
    this.state = {
      isFontFamilyListVisible: false,
      isColorPickerVisible: false,
      editingColor: 'textColor',
      textColor: props.textColor,
      backgroundColor: props.backgroundColor,
      fontFamily: props.fontFamily,
      fontSize: props.fontSize,
    };
  }

  animateInFontFamilyList() {
    const config = {
      toValue: 1,
      duration: 300,
      easing: Easing.quad,
    };
    Animated.parallel([
      Animated.timing(this.mainContentsAnim, config),
      Animated.timing(this.fontFamilyAnim, config),
    ]).start();
  }

  animateOutFontFamilyList() {
    const config = {
      toValue: 0,
      duration: 300,
      easing: Easing.quad,
    };
    Animated.parallel([
      Animated.timing(this.mainContentsAnim, config),
      Animated.timing(this.fontFamilyAnim, config),
    ]).start();
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
    switch (this.state.editingColor) {
      case 'backgroundColor':
        this.colorPickerDidUpdateBackgroundColor(color);
        break;
      case 'textColor':
        this.colorPickerDidUpdateTextColor(color);
        break;
      default:
        break;
    }
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

  showColorPicker(editingColor: EditingColor) {
    this.setState({
      editingColor,
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
      duration: 300,
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
      duration: 300,
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
        <View style={styles.mainContents}>
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
          {/* <RichTextFontColorControl
            color={this.state.textColor}
            style={styles.field}
            onDidRequestShowColorPicker={() =>
              this.showColorPicker('textColor')
            }
            onDidSelectColor={this.colorPickerDidUpdateTextColor}
          /> */}
          <RichTextBackgroundColorControl
            style={styles.field}
            onDidSelectColor={this.colorPickerDidUpdateBackgroundColor}
          />
          <Button style={styles.button} text="Save" onPress={this.save} />
        </View>
      </View>
    );
  }
}
