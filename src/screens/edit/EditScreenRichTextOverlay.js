// @flow
import React, { Component } from 'react';
import { View, SafeAreaView, Animated, Dimensions, Easing } from 'react-native';
import { BlurView } from 'react-native-blur';
import { autobind } from 'core-decorators';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import * as Color from '../../utils/Color';
import EditScreenFontColorControls from './EditScreenFontColorControls';
import EditScreenFontFamilyControls from './EditScreenFontFamilyControls';
import EditScreenBackgroundColorControls from './EditScreenBackgroundColorControls';
import EditScreenFontSizeControls from './EditScreenFontSizeControls';
import RichTextEditorFontFamilyList from '../../components/rich-text-editor/RichTextEditorFontFamilyList';
import RichTextEditorColorPicker from '../../components/rich-text-editor/RichTextEditorColorPicker';

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
  container: (anim: Animated.Value) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: anim,
  }),
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 11,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeAreaContent: {
    flex: 1,
    paddingVertical: 125,
    paddingHorizontal: 23,
  },
  insideWrap: {
    backgroundColor: UI_COLORS.WHITE,
    flex: 1,
    paddingHorizontal: 7,
    paddingVertical: 13,
    borderRadius: 12,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowRadius: 45,
    shadowColor: UI_COLORS.OFF_BLACK,
  },
  inside: {
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
export default class EditScreenRichTextOverlay extends Component<Props, State> {
  anim: Animated.Value = new Animated.Value(0);
  drawerAnim: Animated.Value = new Animated.Value(0);
  state = {
    isFontFamilyListVisible: false,
    isColorPickerVisible: false,
    color: Color.hexToRgbaObject(UI_COLORS.DARK_GREY),
  };

  componentDidMount() {
    if (this.props.isVisible) {
      this.animateIn();
    } else if (!this.props.isVisible) {
      this.animateOut();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.isVisible && !prevProps.isVisible) {
      this.animateIn();
    } else if (!this.props.isVisible && prevProps.isVisible) {
      this.animateOut();
    }
  }

  animateIn() {
    Animated.timing(this.anim, {
      toValue: 1,
      duration: 300,
    }).start();
  }

  animateOut() {
    Animated.timing(this.anim, {
      toValue: 0,
      duration: 300,
    }).start();
  }

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

  colorPickerDidUpdateFontColor(color: ColorRGBA) {
  }

  colorPickerDidUpdateBackgroundColor(color: ColorRGBA) {
  }

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
      <Animated.View
        style={[styles.container(this.anim), this.props.style]}
        pointerEvents={this.props.isVisible ? 'auto' : 'none'}
      >
        <BlurView style={styles.blurView} blurType="dark" blurAmount={25} />
        <SafeAreaView style={styles.flex}>
          <View style={styles.safeAreaContent}>
            <View style={styles.insideWrap}>
              <View style={styles.inside}>
                <Animated.View style={styles.mainContents(this.drawerAnim)}>
                  <EditScreenFontFamilyControls
                    style={styles.field}
                    fontFamily={this.props.fontFamily}
                    onRequestShowFontFamilySelection={this.showFontFamilyList}
                  />
                  <EditScreenFontSizeControls
                    fontSize={16}
                    style={styles.field}
                  />
                  <View style={[styles.row, styles.field]}>
                    <EditScreenFontColorControls
                      color={this.props.textColor}
                      style={styles.flex}
                      onDidRequestShowColorPicker={this.showColorPicker}
                      onDidSelectColor={this.colorPickerDidUpdateFontColor}
                    />
                    <EditScreenBackgroundColorControls
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
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    );
  }
}
