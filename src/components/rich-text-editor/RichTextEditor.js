// @flow
import React, { Component } from 'react';
import { View, Animated, Dimensions, Easing, StyleSheet } from 'react-native';
import { autobind } from 'core-decorators';
import throttle from 'lodash/throttle';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import * as Color from '../../utils/Color';
import RichTextFontColorControl from './RichTextFontColorControl';
import RichTextFontFamilyControl from './RichTextFontFamilyControl';
import RichTextBackgroundColorControl from './RichTextBackgroundColorControl';
import RichTextFontSizeControl from './RichTextFontSizeControl';
import RichTextEditorFontFamilyList from './RichTextEditorFontFamilyList';
import RichTextEditorColorPicker from './RichTextEditorColorPicker';
import Button from '../button/Button';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';

type Props = {
  style?: ?Style,
  isVisible: boolean,
  fontFamily: string,
  textColor: ColorRGBA,
  backgroundColor: ColorRGBA,
};

type State = {
  isFontFamilyListVisible: boolean,
  isColorPickerVisible: boolean,
  color: ColorRGBA,
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
  state = {
    isFontFamilyListVisible: false,
    isColorPickerVisible: false,
    color: Color.hexToRgbaObject(UI_COLORS.DARK_GREY),
  };

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

  fontFamilyListDidSelectFontFamily(fontFamily: string) {}

  colorPickerDidUpdateColorThrottled = throttle(
    this.colorPickerDidUpdateColor,
    100,
    { leading: true }
  );

  colorPickerDidUpdateColor(color: ColorRGBA) {
    this.setState({
      color,
    });
  }

  colorPickerDidUpdateFontColor(color: ColorRGBA) {}

  colorPickerDidUpdateBackgroundColor(color: ColorRGBA) {}

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

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Animated.View style={styles.mainContents(this.mainContentsAnim)}>
          <RichTextFontFamilyControl
            style={styles.field}
            fontFamily={this.props.fontFamily}
            onRequestShowFontFamilySelection={this.showFontFamilyList}
          />
          <RichTextFontSizeControl fontSize={16} style={styles.field} />
          <View style={[styles.row, styles.field]}>
            <RichTextFontColorControl
              color={this.props.textColor}
              style={styles.flex}
              onDidRequestShowColorPicker={this.showColorPicker}
              onDidSelectColor={this.colorPickerDidUpdateFontColor}
            />
            <RichTextBackgroundColorControl
              color={this.props.backgroundColor}
              style={styles.flex}
              onDidRequestShowColorPicker={this.showColorPicker}
              onDidSelectColor={this.colorPickerDidUpdateBackgroundColor}
            />
          </View>
          <Button style={styles.button} text="Save" onPress={() => {}} />
        </Animated.View>
        <Animated.View
          style={styles.fontFamilyList(this.fontFamilyAnim)}
          pointerEvents={this.state.isFontFamilyListVisible ? 'auto' : 'none'}
        >
          <RichTextEditorFontFamilyList
            style={styles.flex}
            onSelectFont={this.fontFamilyListDidSelectFontFamily}
            onRequestHide={this.hideFontFamilyList}
          />
        </Animated.View>
        <Animated.View
          style={styles.colorPickerWrap(this.colorPickerAnim)}
          pointerEvents={this.state.isColorPickerVisible ? 'auto' : 'none'}
        >
          <RichTextEditorColorPicker
            style={styles.flex}
            color={this.state.color}
            onDidUpdateColor={this.colorPickerDidUpdateColorThrottled}
            onRequestHide={this.hideColorPicker}
          />
        </Animated.View>
      </View>
    );
  }
}
