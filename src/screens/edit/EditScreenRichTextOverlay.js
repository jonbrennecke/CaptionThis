// @flow
import React, { Component } from 'react';
import {
  View,
  SafeAreaView,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native';
import { BlurView } from 'react-native-blur';
import { autobind } from 'core-decorators';

import { UI_COLORS } from '../../constants';
import RichTextEditor from '../../components/rich-text-editor/RichTextEditor';

import type { Style } from '../../types/react';
import type { ColorRGBA } from '../../types/media';
import type { SpeechTranscription } from '../../types/speech';

type Props = {
  style?: ?Style,
  playbackTime: number,
  hasFinalTranscription: boolean,
  isVisible: boolean,
  duration: number,
  fontFamily: string,
  fontSize: number,
  textColor: ColorRGBA,
  backgroundColor: ColorRGBA,
  speechTranscription: ?SpeechTranscription,
  onRequestSave: ({
    fontSize: number,
    fontFamily: string,
    textColor: ColorRGBA,
    backgroundColor: ColorRGBA,
  }) => void,
  onRequestDismissWithoutSaving: () => void,
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
  bottomSheet: (anim: Animated.Value) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [300, 0],
        }),
      },
    ],
  }),
  insideWrap: {
    flex: 1,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowRadius: 45,
    shadowColor: UI_COLORS.OFF_BLACK,
    justifyContent: 'center',
  },
  inside: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
};

// $FlowFixMe
@autobind
export default class EditScreenRichTextOverlay extends Component<Props> {
  fadeAnim = new Animated.Value(0);
  sheetAnim = new Animated.Value(0);

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
    Animated.parallel([
      Animated.timing(this.fadeAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.quad,
      }),
      Animated.timing(this.sheetAnim, {
        toValue: 1,
        duration: 150,
        delay: 200,
      }),
    ]).start();
  }

  animateOut() {
    Animated.parallel([
      Animated.timing(this.fadeAnim, {
        toValue: 0,
        duration: 200,
        delay: 200,
        easing: Easing.quad,
      }),
      Animated.timing(this.sheetAnim, {
        toValue: 0,
        duration: 150,
      }),
    ]).start();
  }

  render() {
    return (
      <Animated.View
        style={[styles.container(this.fadeAnim), this.props.style]}
        pointerEvents={this.props.isVisible ? 'auto' : 'none'}
      >
        <TouchableWithoutFeedback
          onPress={this.props.onRequestDismissWithoutSaving}
        >
          <BlurView style={styles.blurView} blurType="dark" blurAmount={25} />
        </TouchableWithoutFeedback>
        <Animated.View style={styles.bottomSheet(this.sheetAnim)}>
          <SafeAreaView style={styles.flex}>
            <View style={styles.insideWrap}>
              <RichTextEditor
                style={styles.inside}
                playbackTime={this.props.playbackTime}
                duration={this.props.duration}
                isVisible={this.props.isVisible}
                hasFinalTranscription={this.props.hasFinalTranscription}
                speechTranscription={this.props.speechTranscription}
                fontSize={this.props.fontSize}
                fontFamily={this.props.fontFamily}
                textColor={this.props.textColor}
                backgroundColor={this.props.backgroundColor}
                onRequestSave={this.props.onRequestSave}
              />
            </View>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    );
  }
}
