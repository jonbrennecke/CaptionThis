// @flow
import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

import { UI_COLORS } from '../../constants';
import FadeInOutAnimatedView from '../../components/animations/FadeInOutAnimatedView';
import EditScreenLoadingBackground from './EditScreenLoadingBackground';
import NumericProgressCircle from '../../components/progress-circle/NumericProgressCircle';
import ProgressCircleContainer from '../../components/progress-circle/ProgressCircleContainer';

import type { Style, SFC } from '../../types';

export type EditScreenExportingOverlayProps = {
  style?: ?Style,
  isVisible: boolean,
  progress: number,
  onDidDismiss: () => void,
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

// eslint-disable-next-line flowtype/generic-spacing
export const EditScreenExportingOverlay: SFC<
  EditScreenExportingOverlayProps
> = ({
  isVisible,
  style,
  onDidDismiss,
  progress,
}: EditScreenExportingOverlayProps) => (
  <FadeInOutAnimatedView
    // $FlowFixMe
    style={[styles.container, style]}
    isVisible={isVisible}
    onFadeOutDidComplete={onDidDismiss}
  >
    <EditScreenLoadingBackground />
    <SafeAreaView style={styles.flexCenter}>
      <ProgressCircleContainer
        radius={CIRCLE_RADIUS}
        renderProgressElement={props => (
          <NumericProgressCircle
            progress={progress * 100}
            fillColor={UI_COLORS.WHITE}
            {...props}
          />
        )}
        renderTextElement={props => (
          <Text numberOfLines={1} {...props}>
            {`${(progress * 100).toFixed(0)}%`}
          </Text>
        )}
      />
    </SafeAreaView>
  </FadeInOutAnimatedView>
);
