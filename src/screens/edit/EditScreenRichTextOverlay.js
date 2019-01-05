// @flow
import React, { Component } from 'react';
import { View, SafeAreaView, Animated } from 'react-native';
import { BlurView } from 'react-native-blur';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import EditScreenFontColorControls from './EditScreenFontColorControls';
import EditScreenFontFamilyControls from './EditScreenFontFamilyControls';
import EditScreenBackgroundColorControls from './EditScreenBackgroundColorControls';
import EditScreenFontSizeControls from './EditScreenFontSizeControls';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';

type Props = {
  style?: ?Style,
  isVisible: boolean,
  fontFamily: string,
  textColor: ColorRGBA,
  backgroundColor: ColorRGBA,
};

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
  insideWrap: {
    flex: 1,
    paddingVertical: 180,
    paddingHorizontal: 23,
  },
  inside: {
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
};

export default class EditScreenRichTextOverlay extends Component<Props> {
  anim: Animated.Value = new Animated.Value(0);

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

  render() {
    return (
      <Animated.View
        style={[styles.container(this.anim), this.props.style]}
        pointerEvents={this.props.isVisible ? 'auto' : 'none'}
      >
        <BlurView style={styles.blurView} blurType="dark" blurAmount={25} />
        <SafeAreaView style={styles.flex}>
          <View style={styles.insideWrap}>
            <View style={styles.inside}>
              <EditScreenFontFamilyControls
                fontFamily={this.props.fontFamily}
                style={styles.field}
              />
              <EditScreenFontSizeControls fontSize={16} style={styles.field} />
              <View style={[styles.row, styles.field]}>
                <EditScreenFontColorControls
                  color={this.props.textColor}
                  style={styles.flex}
                />
                <EditScreenBackgroundColorControls
                  color={this.props.backgroundColor}
                  style={styles.flex}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    );
  }
}
