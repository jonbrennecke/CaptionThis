// @flow
import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

import { UI_COLORS } from '../../constants';
import FadeInOutAnimatedView from '../../components/animations/FadeInOutAnimatedView';
import EditScreenLoadingBackground from './EditScreenLoadingBackground';
import NumericProgressCircle from '../../components/progress-circle/NumericProgressCircle';
import ProgressCircleContainer from '../../components/progress-circle/ProgressCircleContainer';

import type { Style } from '../../types/react';

type Props = {
  style?: ?Style,
  isVisible: boolean,
  progress: number,
};

const CIRCLE_RADIUS = 175;

const styles = {
  container: StyleSheet.absoluteFillObject,
  flexCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
    marginTop: 15,
  },
};

export default class EditScreenExportingOverlay extends Component<Props> {
  render() {
    return (
      <FadeInOutAnimatedView
        style={[styles.container, this.props.style]}
        isVisible={this.props.isVisible}
      >
        <EditScreenLoadingBackground/>
        <SafeAreaView style={styles.flexCenter}>
          <ProgressCircleContainer
            radius={CIRCLE_RADIUS}
            renderProgressElement={props => (
              <NumericProgressCircle
                progress={this.props.progress * 100}
                fillColor={UI_COLORS.WHITE}
                {...props}
              />
            )}
            renderTextElement={props => (
              <Text numberOfLines={1} {...props}>
                {`${(this.props.progress * 100).toFixed(0)}%`}
              </Text>
            )}
          />
        </SafeAreaView>
      </FadeInOutAnimatedView>
    );
  }
}
