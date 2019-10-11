// @flow
import React, { PureComponent, createRef } from 'react';
import { View, Animated, TouchableWithoutFeedback, Easing } from 'react-native';
import { VideoPlayer } from '@jonbrennecke/react-native-media';
import ReactNativeHaptic from 'react-native-haptic';
import noop from 'lodash/noop';
import { autobind } from 'core-decorators';

import { Draggable } from '../draggable';
import { Units, Colors } from '../../constants';
import { ResizeIcon } from '../icons';

import type { Size, PlaybackState } from '@jonbrennecke/react-native-media';

import type { Style, Return } from '../../types';

export type FloatingVideoPlayerProps = {
  style?: ?Style,
  iconAccentColor: $Values<typeof Colors.solid>,
  videoID: string,
  // $FlowFixMe
  videoPlayerRef?: Return<createRef<VideoPlayer>>,
  initialPosition?: { x: number, y: number },
  onVideoDidUpdatePlaybackTime?: (
    playbackTime: number,
    duration: number
  ) => void,
  onVideoWillRestart?: () => void,
  onViewDidResize?: Size => void,
  onPlaybackStateChange?: PlaybackState => void,
};

export type FloatingVideoPlayerState = {
  isMinimized: boolean,
};

const styles = {
  flex: {
    flex: 1,
  },
  draggable: {},
  draggableContentContainer: {
    width: 100,
    height: 16 / 9 * 100,
  },
  videoPlayerAndButtonContainer: {
    flex: 1,
  },
  videoPlayerContainer: (resizeAnim: Animated.Value) => ({
    flex: 1,
    borderWidth: 3,
    borderColor: Colors.solid.white,
    backgroundColor: Colors.solid.white,
    borderRadius: Units.extraSmall,
    opacity: resizeAnim,
  }),
  minimizeButton: (
    resizeAnim: Animated.Value,
    backgroundColor: $Values<typeof Colors.solid>
  ) => ({
    position: 'absolute',
    bottom: Units.small,
    left: Units.small,
    backgroundColor: resizeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [backgroundColor, Colors.solid.white],
    }),
    width: Units.extraLarge,
    height: Units.extraLarge,
    borderRadius: Units.extraLarge * 0.5,
    padding: Units.extraSmall,
  }),
  resizeAnimation: (resizeAnim: Animated.Value) => ({
    width: resizeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [Units.extraLarge, 100],
    }),
    height: resizeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [Units.extraLarge, 16 / 9 * 100],
    }),
    bottom: 0,
    left: 0,
    position: 'absolute',
    shadowColor: Colors.solid.darkGray,
    shadowOpacity: 0.35,
    shadowRadius: 7,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    borderRadius: resizeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [Units.extraLarge * 0.5, Units.extraSmall],
    }),
  }),
};

function hapticFeedback() {
  ReactNativeHaptic.generate('selection');
}

// $FlowFixMe
@autobind
export class FloatingVideoPlayer extends PureComponent<
  FloatingVideoPlayerProps,
  FloatingVideoPlayerState
> {
  state: FloatingVideoPlayerState = {
    isMinimized: false,
  };
  resizeAnim = new Animated.Value(1);
  draggableRef = createRef();

  minimize() {
    if (this.draggableRef.current) {
      this.draggableRef.current.returnToInitialPosition();
    }
    Animated.timing(this.resizeAnim, {
      toValue: 0,
      easing: Easing.inOut(Easing.quad),
      duration: 150,
    }).start(() => {
      this.setState({
        isMinimized: true,
      });
    });
  }

  maximize() {
    Animated.timing(this.resizeAnim, {
      toValue: 1,
      easing: Easing.inOut(Easing.quad),
      duration: 150,
    }).start(() => {
      this.setState({
        isMinimized: false,
      });
    });
  }

  render() {
    const {
      style,
      iconAccentColor,
      videoID,
      videoPlayerRef,
      initialPosition,
      onVideoDidUpdatePlaybackTime = noop,
      onPlaybackStateChange = noop,
      onVideoWillRestart = noop,
    } = this.props;
    return (
      <Draggable
        ref={this.draggableRef}
        style={[styles.draggable, style]}
        disabled={this.state.isMinimized}
        initialPosition={initialPosition}
        contentContainerStyle={styles.draggableContentContainer}
        onDragStart={hapticFeedback}
        onDragEnd={hapticFeedback}
      >
        <Animated.View
          style={styles.resizeAnimation(this.resizeAnim)}
          pointerEvents="box-none"
        >
          <TouchableWithoutFeedback
            onPress={() => {
              hapticFeedback();
              this.state.isMinimized ? this.maximize() : this.minimize();
            }}
          >
            <View
              style={styles.videoPlayerAndButtonContainer}
              pointerEvents="box-none"
            >
              <Animated.View
                style={styles.videoPlayerContainer(this.resizeAnim)}
                pointerEvents="box-none"
              >
                <VideoPlayer
                  style={styles.flex}
                  assetID={videoID}
                  ref={videoPlayerRef}
                  onPlaybackStateDidChange={onPlaybackStateChange}
                  onPlaybackTimeDidUpdate={onVideoDidUpdatePlaybackTime}
                  onVideoWillRestart={onVideoWillRestart}
                />
              </Animated.View>
              <Animated.View
                style={styles.minimizeButton(this.resizeAnim, iconAccentColor)}
                pointerEvents="box-none"
              >
                <ResizeIcon
                  style={styles.flex}
                  color={
                    this.state.isMinimized
                      ? Colors.solid.white
                      : iconAccentColor
                  }
                />
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </Draggable>
    );
  }
}
