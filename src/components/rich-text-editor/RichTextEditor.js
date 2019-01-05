// @flow
import React, { Component } from 'react';
import { View, Animated, Dimensions, Easing, StyleSheet } from 'react-native';
import { autobind } from 'core-decorators';
import throttle from 'lodash/throttle';

import * as Fonts from '../../utils/Fonts';
import RichTextFontColorControl from './RichTextFontColorControl';
import RichTextFontFamilyControl from './RichTextFontFamilyControl';
import RichTextBackgroundColorControl from './RichTextBackgroundColorControl';
import RichTextFontSizeControl from './RichTextFontSizeControl';
import RichTextEditorFontFamilyList from './RichTextEditorFontFamilyList';
import RichTextEditorColorPicker from './RichTextEditorColorPicker';
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
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  buttonText: Fonts.getFontStyle('button', { contentStyle: 'lightContent' }),
  buttonLabelText: Fonts.getFontStyle('formLabel', {
    contentStyle: 'lightContent',
  }),
  field: {
    paddingVertical: 10,
  },
  fontFamilyList: (anim: Animated.Value) => ({
    ...StyleSheet.absoluteFillObject,
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [SCREEN_HEIGHT, 0],
        }),
      },
    ],
  }),
  colorPickerWrap: (anim: Animated.Value) => ({
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [SCREEN_HEIGHT, 0],
        }),
      },
    ],
  }),
  mainContents: (anim: Animated.Value) => ({
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingBottom: 13,
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -SCREEN_HEIGHT],
        }),
      },
    ],
  }),
  button: {
    marginHorizontal: 10,
  },
};

// $FlowFixMe
@autobind
export default class RichTextEditor extends Component<Props, State> {
  fontFamilyAnim: Animated.Value = new Animated.Value(0);
  colorPickerAnim: Animated.Value = new Animated.Value(0);
  mainContentsAnim: Animated.Value = new Animated.Value(0);

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

  showFontFamilyList() {
    this.setState({
      isFontFamilyListVisible: true,
    });
    this.animateInFontFamilyList();
  }

  hideFontFamilyList() {
    this.setState({
      isFontFamilyListVisible: false,
    });
    this.animateOutFontFamilyList();
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
    this.hideFontFamilyList();
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
      case 'textClolor':
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

  save() {}

  fontSizeControlDidSelectFontSize(fontSize: number) {
    this.setState({
      fontSize,
    });
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Animated.View style={styles.mainContents(this.mainContentsAnim)}>
          <RichTextFontFamilyControl
            style={styles.field}
            fontFamily={this.state.fontFamily}
            onRequestShowFontFamilySelection={this.showFontFamilyList}
          />
          <RichTextFontSizeControl
            fontSize={this.state.fontSize}
            style={styles.field}
            onDidSelectFontSize={this.fontSizeControlDidSelectFontSize}
          />
          <View style={[styles.row, styles.field]}>
            <RichTextFontColorControl
              color={this.state.textColor}
              style={styles.flex}
              onDidRequestShowColorPicker={() =>
                this.showColorPicker('textColor')
              }
              onDidSelectColor={this.colorPickerDidUpdateTextColor}
            />
            <RichTextBackgroundColorControl
              color={this.state.backgroundColor}
              style={styles.flex}
              onDidRequestShowColorPicker={() =>
                this.showColorPicker('backgroundColor')
              }
              onDidSelectColor={this.colorPickerDidUpdateBackgroundColor}
            />
          </View>
          <Button style={styles.button} text="Save" onPress={this.save} />
        </Animated.View>
        <Animated.View
          style={styles.fontFamilyList(this.fontFamilyAnim)}
          pointerEvents={this.state.isFontFamilyListVisible ? 'auto' : 'none'}
        >
          <RichTextEditorFontFamilyList
            style={styles.flex}
            onDidSelectFontFamily={this.fontFamilyListDidSelectFontFamily}
            onRequestHide={this.hideFontFamilyList}
          />
        </Animated.View>
        <Animated.View
          style={styles.colorPickerWrap(this.colorPickerAnim)}
          pointerEvents={this.state.isColorPickerVisible ? 'auto' : 'none'}
        >
          <RichTextEditorColorPicker
            style={styles.flex}
            color={
              this.state.editingColor === 'backgroundColor'
                ? this.state.backgroundColor
                : this.state.textColor
            }
            onDidUpdateColor={this.colorPickerDidUpdateColorThrottled}
            onRequestHide={this.hideColorPicker}
          />
        </Animated.View>
      </View>
    );
  }
}
