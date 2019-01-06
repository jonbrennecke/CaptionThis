// @flow
import React, { Component } from 'react';
import { Text, Animated } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

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
    backgroundColor: UI_COLORS.DARK_GREY,
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
    ...Fonts.getFontStyle('heading', { contentStyle: 'lightContent' }),
    textAlign: 'center',
  },
  paragraph: {
    ...Fonts.getFontStyle('default', { contentStyle: 'lightContent' }),
    textAlign: 'center',
    marginVertical: 15,
  },
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
  anim = new Animated.Value(1.0);

  async requestPermissons() {
    await this.props.requestAppPermissions();
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
