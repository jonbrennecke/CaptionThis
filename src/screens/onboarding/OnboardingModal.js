// @flow
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import Button from '../../components/button/Button';
import { requestAppPermissions } from '../../redux/onboarding/actionCreators';

import type { Dispatch } from '../../types/redux';

type OwnProps = {};

type StateProps = {};

type DispatchProps = {
  requestAppPermissions: () => Promise<any>,
};

type Props = OwnProps & StateProps & DispatchProps;

const styles = {
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.DARK_GREY,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  nextButton: {
    borderWidth: StyleSheet.hairlineWidth,
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

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    requestAppPermissions: () => dispatch(requestAppPermissions()),
  };
}

// $FlowFixMe
@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class OnboardingModal extends Component<Props> {
  async requestPermissons() {
    await this.props.requestAppPermissions();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Welcome</Text>
        <Text style={styles.paragraph}>
          {`To get started, we need your permission to use your phone's
          camera and microphone.`}
        </Text>
        <Button
          style={styles.nextButton}
          text="NEXT"
          onPress={() => {
            this.requestPermissons();
          }}
        />
      </View>
    );
  }
}
