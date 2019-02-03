// @flow
import React, { Component } from 'react';
import {
  Text,
  View,
  Animated,
  StyleSheet,
  Image,
  SafeAreaView,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import Button from '../../components/button/Button';
import { requestAppPermissions } from '../../redux/onboarding/actionCreators';
import { arePermissionsGranted } from '../../redux/onboarding/selectors';

import type { Dispatch, AppState } from '../../types/redux';

type OwnProps = {
  onUserDidCompleteOnboarding: () => void,
};

type StateProps = {
  arePermissionsGranted: boolean,
};

type DispatchProps = {
  requestAppPermissions: () => Promise<any>,
};

type Props = OwnProps & StateProps & DispatchProps;

type State = {
  animationInIsComplete: boolean,
};

const INITIAL_DELAY = 500;

const styles = {
  container: (anim: Animated.Value) => ({
    flex: 1,
    backgroundColor: UI_COLORS.OFF_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: anim,
  }),
  nextButton: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: UI_COLORS.OFF_WHITE,
    marginTop: 25,
  },
  heading: {
    ...Fonts.getFontStyle('title', { contentStyle: 'darkContent' }),
    textAlign: 'center',
  },
  paragraph: {
    ...Fonts.getFontStyle('default', { contentStyle: 'darkContent' }),
    textAlign: 'center',
    marginVertical: 15,
  },
  absoluteFill: StyleSheet.absoluteFillObject,
  appIcon: {
    height: 128,
    width: 128,
  },
  appIconWrap: (anim: Animated.Value) => ({
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -65],
        }),
      },
    ],
  }),
  textWrap: (anim: Animated.Value) => ({
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 65,
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [200, 125],
        }),
      },
    ],
  }),
  safeAreaContents: {},
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicatorWrap: (anim: Animated.Value) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -65,
    opacity: anim,
  }),
  activityIndicator: {},
};

function mapStateToProps(state: AppState): StateProps {
  return {
    arePermissionsGranted: arePermissionsGranted(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<*>): DispatchProps {
  return {
    requestAppPermissions: () => dispatch(requestAppPermissions()),
  };
}

// $FlowFixMe
@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class Onboarding extends Component<Props, State> {
  fadeAnim: Animated.Value;
  iconAnim: Animated.Value;
  activityIndicatorAnim: Animated.Value;
  textAnim: Animated.Value;
  state = {
    animationInIsComplete: false,
  };

  async requestPermissons() {
    await this.props.requestAppPermissions();
  }

  constructor(props: Props) {
    super(props);
    this.fadeAnim = new Animated.Value(1);
    this.iconAnim = new Animated.Value(0);
    this.activityIndicatorAnim = new Animated.Value(0);
    this.textAnim = new Animated.Value(0);
  }

  componentDidMount() {
    SplashScreen.hide();
    const isVisible = !this.props.arePermissionsGranted;
    if (isVisible) {
      this.animateIn();
    } else {
      this.animateOut();
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.arePermissionsGranted && !prevProps.arePermissionsGranted) {
      this.animateOut();
    } else if (
      !this.props.arePermissionsGranted &&
      prevProps.arePermissionsGranted
    ) {
      this.animateIn();
    }
    if (
      this.props.arePermissionsGranted &&
      this.state.animationInIsComplete &&
      !prevState.animationInIsComplete
    ) {
      this.animateOut();
    }
  }

  animateIn() {
    Animated.parallel([
      Animated.timing(this.fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: INITIAL_DELAY,
        useNativeDriver: true,
      }),
      Animated.timing(this.iconAnim, {
        toValue: 1,
        duration: 350,
        delay: INITIAL_DELAY + 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(this.activityIndicatorAnim, {
        toValue: 1,
        duration: 350,
        delay: INITIAL_DELAY + 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.setState({
        animationInIsComplete: true,
      });
      if (!this.props.arePermissionsGranted) {
        this.animateInPermissionsText();
      }
    });
  }

  animateInPermissionsText() {
    Animated.parallel([
      Animated.timing(this.activityIndicatorAnim, {
        toValue: 0,
        duration: 350,
        delay: 0,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(this.textAnim, {
        toValue: 1,
        duration: 350,
        delay: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }

  animateOut() {
    if (!this.state.animationInIsComplete) {
      return;
    }
    Animated.parallel([
      Animated.timing(this.fadeAnim, {
        toValue: 0,
        duration: 300,
        delay: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(this.iconAnim, {
        toValue: 0,
        duration: 300,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.props.onUserDidCompleteOnboarding();
    });
  }

  render() {
    return (
      <Animated.View style={styles.container(this.fadeAnim)}>
        <Image
          style={styles.absoluteFill}
          source={{ uri: 'Launch Screen Gradient' }}
        />
        <Animated.View style={styles.appIconWrap(this.iconAnim)}>
          <Image source={{ uri: 'Icon' }} style={styles.appIcon} />
          <Animated.View
            style={styles.activityIndicatorWrap(this.activityIndicatorAnim)}
          >
            <ActivityIndicator
              style={styles.activityIndicator}
              color={UI_COLORS.WHITE}
              size="large"
            />
          </Animated.View>
        </Animated.View>
        <Animated.View style={styles.textWrap(this.textAnim)}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.safeAreaContents}>
              <Text style={styles.heading}>Welcome</Text>
              <Text style={styles.paragraph}>
                {`To get started, we need your permission to use your phone's camera and microphone.`}
              </Text>
              <Button
                style={styles.nextButton}
                text="NEXT"
                onPress={() => {
                  this.requestPermissons();
                }}
              />
            </View>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    );
  }
}
