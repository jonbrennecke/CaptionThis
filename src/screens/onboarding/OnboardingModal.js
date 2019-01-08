// @flow
import React, { Component } from 'react';
import { Text, Animated, StyleSheet, StatusBar } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import Button from '../../components/button/Button';
import { requestAppPermissions } from '../../redux/onboarding/actionCreators';

import type { Dispatch } from '../../types/redux';

type OwnProps = {
  arePermissionsGranted: boolean,
};

type StateProps = {};

type DispatchProps = {
  requestAppPermissions: () => Promise<any>,
};

type Props = OwnProps & StateProps & DispatchProps;

const styles = {
  container: (anim: Animated.Value) => ({
    flex: 1,
    backgroundColor: UI_COLORS.OFF_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 65,
    opacity: anim,
  }),
  nextButton: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: UI_COLORS.OFF_WHITE,
    marginTop: 25,
  },
  heading: {
    ...Fonts.getFontStyle('heading', { contentStyle: 'darkContent' }),
    textAlign: 'center',
  },
  paragraph: {
    ...Fonts.getFontStyle('default', { contentStyle: 'darkContent' }),
    textAlign: 'center',
    marginVertical: 15,
  },
  absoluteFill: StyleSheet.absoluteFillObject
};

function mapStateToProps(): StateProps {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch<*>): DispatchProps {
  return {
    requestAppPermissions: () => dispatch(requestAppPermissions()),
  };
}

// $FlowFixMe
@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class OnboardingModal extends Component<Props> {
  anim: Animated.Value;

  async requestPermissons() {
    await this.props.requestAppPermissions();
  }

  constructor(props: Props) {
    super(props);
    this.anim = new Animated.Value(props.arePermissionsGranted ? 1 : 0);
  }

  componentDidMount() {
    const isVisible = !this.props.arePermissionsGranted;
    if (isVisible) {
      this.animateIn();
    } else {
      this.animateOut();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.arePermissionsGranted && !prevProps.arePermissionsGranted) {
      this.animateOut();
    } else if (
      !this.props.arePermissionsGranted &&
      prevProps.arePermissionsGranted
    ) {
      this.animateIn();
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
      <Animated.View style={styles.container(this.anim)}>
        <StatusBar barStyle="dark-content"/>
        <LinearGradient
          style={styles.absoluteFill}
          colors={[
            UI_COLORS.WHITE,
            UI_COLORS.OFF_WHITE,
          ]}
        />
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
      </Animated.View>
    );
  }
}
