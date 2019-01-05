// @flow
import React, { Component } from 'react';
import { View, SafeAreaView, Animated } from 'react-native';
import { BlurView } from 'react-native-blur';
import { autobind } from 'core-decorators';

import { UI_COLORS } from '../../constants';
import RichTextEditor from '../../components/rich-text-editor/RichTextEditor';

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
};

// $FlowFixMe
@autobind
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
          <View style={styles.safeAreaContent}>
            <View style={styles.insideWrap}>
              <RichTextEditor
                style={styles.inside}
                isVisible={this.props.isVisible}
                fontFamily={this.props.fontFamily}
                textColor={this.props.textColor}
                backgroundColor={this.props.backgroundColor}
              />
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    );
  }
}
