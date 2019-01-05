// @flow
import React, { Component } from 'react';
import {
  View,
  SafeAreaView,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { BlurView } from 'react-native-blur';
import { autobind } from 'core-decorators';
// $FlowFixMe
import SafeArea from 'react-native-safe-area';

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
  onRequestSave: ({
    fontSize: number,
    fontFamily: string,
    textColor: ColorRGBA,
    backgroundColor: ColorRGBA,
  }) => void,
};

type State = {
  safeAreaHeight: number,
};

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

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
  safeAreaContent: (height: number) => ({
    width: SCREEN_WIDTH,
    paddingVertical: 145,
    paddingHorizontal: 23,
    height,
  }),
  insideWrap: {
    backgroundColor: UI_COLORS.WHITE,
    flex: 1,
    paddingHorizontal: 7,
    borderRadius: 12,
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
    overflow: 'hidden',
    flex: 1,
  },
  flex: {
    flex: 1,
  },
};

// $FlowFixMe
@autobind
export default class EditScreenRichTextOverlay extends Component<Props, State> {
  anim = new Animated.Value(0);
  scrollViewContentOffsetY = new Animated.Value(0);
  scrollView: ?ScrollView;
  state = {
    safeAreaHeight: 0,
  };

  async componentDidMount() {
    if (this.props.isVisible) {
      this.animateIn();
    } else if (!this.props.isVisible) {
      this.animateOut();
    }
    const { safeAreaInsets } = await SafeArea.getSafeAreaInsetsForRootView();
    this.setState({
      safeAreaHeight:
        SCREEN_HEIGHT - safeAreaInsets.top - safeAreaInsets.bottom,
    });
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

  scrollViewDidScroll() {
    return Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              y: this.scrollViewContentOffsetY,
            },
          },
        },
      ],
      { useNativeDriver: true }
    );
  }

  lockScroll() {
    if (this.scrollView) {
      this.scrollView.setNativeProps({
        scrollEnabled: false,
      });
    }
  }

  unlockScroll() {
    if (this.scrollView) {
      this.scrollView.setNativeProps({
        scrollEnabled: true,
      });
    }
  }

  render() {
    return (
      <Animated.View
        style={[styles.container(this.anim), this.props.style]}
        pointerEvents={this.props.isVisible ? 'auto' : 'none'}
      >
        <BlurView style={styles.blurView} blurType="dark" blurAmount={25} />
        <SafeAreaView style={styles.flex}>
          <ScrollView
            ref={ref => {
              this.scrollView = ref;
            }}
            style={styles.flex}
            showsVerticalScrollIndicator={false}
            overScrollMode="always"
            alwaysBounceVertical
            onScroll={this.scrollViewDidScroll}
          >
            <View style={styles.safeAreaContent(this.state.safeAreaHeight)}>
              <View style={styles.insideWrap}>
                <RichTextEditor
                  style={styles.inside}
                  isVisible={this.props.isVisible}
                  fontSize={16}
                  fontFamily={this.props.fontFamily}
                  textColor={this.props.textColor}
                  backgroundColor={this.props.backgroundColor}
                  onRequestLockScroll={this.lockScroll}
                  onRequestUnlockScroll={this.unlockScroll}
                  onRequestSave={this.props.onRequestSave}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    );
  }
}
