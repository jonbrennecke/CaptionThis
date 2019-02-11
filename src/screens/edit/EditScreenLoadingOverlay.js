// @flow
import React, { Component } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Animated,
  StyleSheet,
  MaskedViewIOS,
  Easing,
} from 'react-native';
import { autobind } from 'core-decorators';

import * as Fonts from '../../utils/Fonts';
import * as Color from '../../utils/Color';
import { UI_COLORS } from '../../constants';
import ProgressCircle from '../../components/progress-circle/ProgressCircle';

import type { Style } from '../../types/react';
import type { VideoObject } from '../../types/media';

type Props = {
  style?: ?Style,
  isVisible: boolean,
  video: VideoObject,
};

type State = {
  countdown: string,
  startTime: number,
};

const CIRCLE_RADIUS = 175;

const styles = {
  container: (anim: Animated.Value) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: anim,
  }),
  outerView: {
    height: CIRCLE_RADIUS,
    width: CIRCLE_RADIUS,
    borderRadius: CIRCLE_RADIUS / 2,
    shadowColor: UI_COLORS.WHITE,
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    height: CIRCLE_RADIUS,
    width: CIRCLE_RADIUS,
    borderRadius: CIRCLE_RADIUS / 2,
    borderWidth: 4,
    position: 'absolute',
  },
  borderMask: {
    height: CIRCLE_RADIUS,
    width: CIRCLE_RADIUS,
    borderRadius: CIRCLE_RADIUS / 2,
    position: 'absolute',
  },
  inner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    opacity: 0.25,
  },
  progress: {
    height: CIRCLE_RADIUS,
    width: CIRCLE_RADIUS,
    borderRadius: CIRCLE_RADIUS / 2,
    position: 'absolute',
  },
  flexCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
    marginBottom: 15,
  },
  countdown: {
    ...Fonts.getFontStyle('heading', {
      contentStyle: 'lightContent',
      size: 'large',
    }),
    textShadowColor: Color.hexToRgbaString(UI_COLORS.BLACK, 0.25),
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 1,
    textAlign: 'center',
  },
  title: {
    ...Fonts.getFontStyle('heading', {
      contentStyle: 'lightContent',
    }),
    textShadowColor: Color.hexToRgbaString(UI_COLORS.BLACK, 0.25),
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 1,
    textAlign: 'center',
    marginTop: 45,
  },
  subtitle: {
    ...Fonts.getFontStyle('default', {
      contentStyle: 'lightContent',
    }),
    textShadowColor: Color.hexToRgbaString(UI_COLORS.BLACK, 0.25),
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 1,
    textAlign: 'center',
    marginTop: 10,
  },
};

// $FlowFixMe
@autobind
export default class EditScreenExportingOverlay extends Component<
  Props,
  State
> {
  state = {
    countdown: '0%',
    startTime: 0,
  };
  animationFrameId: ?AnimationFrameID = null;
  progressListenerId: ?string = null;
  anim: Animated.Value = new Animated.Value(0);
  progressAnim: Animated.Value = new Animated.Value(0);

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
    this.startCountdown();
    const videoLoadingTime = estimateVideoLoadingTime(this.props.video);
    Animated.parallel([
      Animated.timing(this.anim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(this.progressAnim, {
        toValue: 100,
        duration: videoLoadingTime,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  }

  animateOut() {
    Animated.parallel([
      Animated.timing(this.anim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(this.progressAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(this.stopCountdown);
  }

  startCountdown() {
    const currentTime = Date.now();
    this.setState({ startTime: currentTime });
    const id = requestAnimationFrame(this.updateCountdown);
    this.animationFrameId = id;
  }

  stopCountdown() {
    if (!this.animationFrameId) {
      return;
    }
    cancelAnimationFrame(this.animationFrameId);
  }

  updateCountdown() {
    const currentTime = Date.now();
    const ellapsedTime = currentTime - this.state.startTime;
    const videoLoadingTime = estimateVideoLoadingTime(this.props.video);
    const percent = Math.min(ellapsedTime / videoLoadingTime * 100, 100);
    this.setState({
      countdown: `${percent.toFixed(0)}%`,
    });
    const id = requestAnimationFrame(this.updateCountdown);
    this.animationFrameId = id;
  }

  render() {
    return (
      <Animated.View
        pointerEvents={this.props.isVisible ? 'auto' : 'none'}
        style={[styles.container(this.anim), this.props.style]}
      >
        <SafeAreaView style={styles.flexCenter}>
          <Animated.View style={styles.outerView}>
            <MaskedViewIOS
              style={styles.borderMask}
              maskElement={<View style={styles.border} />}
            >
              <View style={styles.inner} />
            </MaskedViewIOS>
            <ProgressCircle
              style={styles.progress}
              progress={this.progressAnim}
              fillColor={UI_COLORS.WHITE}
            />
            <Text style={styles.countdown} numberOfLines={1}>
              {this.state.countdown}
            </Text>
          </Animated.View>
          <Text style={styles.title} numberOfLines={1}>
            Creating captions...
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            Please wait while your captions are generated
          </Text>
        </SafeAreaView>
      </Animated.View>
    );
  }
}

function estimateVideoLoadingTime(video: VideoObject): number {
  return video.duration * 1000 * 0.9;
}
