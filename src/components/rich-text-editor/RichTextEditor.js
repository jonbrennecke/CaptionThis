// @flow
import React, { Component } from 'react';
import { View, Animated, Dimensions, Easing } from 'react-native';
import { autobind } from 'core-decorators';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import * as Color from '../../utils/Color';
import RichTextFontColorControl from './RichTextFontColorControl';
import RichTextFontFamilyControl from './RichTextFontFamilyControl';
import RichTextBackgroundColorControl from './RichTextBackgroundColorControl';
import RichTextFontSizeControl from './RichTextFontSizeControl';
import RichTextEditorFontFamilyList from './RichTextEditorFontFamilyList';
import RichTextEditorColorPicker from './RichTextEditorColorPicker';

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
    overflow: 'hidden',
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
};

// $FlowFixMe
@autobind
export default class RichTextEditor extends Component<Props, State> {
  drawerAnim: Animated.Value = new Animated.Value(0);
  state = {
    isFontFamilyListVisible: false,
    isColorPickerVisible: false,
    color: Color.hexToRgbaObject(UI_COLORS.DARK_GREY),
  };

  showFontFamilyList() {
    this.setState({
      isFontFamilyListVisible: true,
    });
    this.animateInDrawer();
  }

  hideFontFamilyList() {
    this.setState({
      isFontFamilyListVisible: false,
    });
    this.animateOutDrawer();
  }

  animateInDrawer() {
    Animated.timing(this.drawerAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.quad,
    }).start();
  }

  animateOutDrawer() {
    Animated.timing(this.drawerAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.quad,
    }).start();
  }

  fontFamilyListDidSelectFontFamily(fontFamily: string) {}

  colorPickerDidUpdateColor(color: ColorRGBA) {
    // TODO: throttle
  }

  colorPickerDidUpdateFontColor(color: ColorRGBA) {}

  colorPickerDidUpdateBackgroundColor(color: ColorRGBA) {}

  showColorPicker() {
    this.setState({
      isColorPickerVisible: true,
    });
    this.animateInDrawer();
  }

  hideColorPicker() {
    this.setState({
      isColorPickerVisible: false,
    });
    this.animateOutDrawer();
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Animated.View style={styles.mainContents(this.drawerAnim)}>
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
            />
          </View>
        </Animated.View>
        <Animated.View
          style={styles.fontFamilyList(this.drawerAnim)}
          pointerEvents={
            this.state.isFontFamilyListVisible ||
            this.state.isColorPickerVisible
              ? 'auto'
              : 'none'
          }
        >
          {/* <RichTextEditorFontFamilyList
            style={styles.flex}
            onSelectFont={this.fontFamilyListDidSelectFontFamily}
            onRequestHide={this.hideFontFamilyList}
            /> */}
          <RichTextEditorColorPicker
            color={this.state.color}
            onDidUpdateColor={this.colorPickerDidUpdateColor}
            onRequestHide={this.hideColorPicker}
          />
        </Animated.View>
      </View>
    );
  }
}
