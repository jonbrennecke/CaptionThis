// @flow
import React from 'react';
import { TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { BlurView } from 'react-native-blur';

import FadeInOutAnimatedView from '../animations/FadeInOutAnimatedView';
import BottomSheetAnimatedView from '../animations/BottomSheetAnimatedView';

import type { Style, Children } from '../../types/react';

type Props = {
  style?: ?Style,
  isVisible: boolean,
  onRequestDismissModal: () => void,
  children: ?Children,
};

const styles = {
  absoluteFill: StyleSheet.absoluteFillObject,
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
};

export default function BottomSheetModal(props: Props) {
  return (
    <FadeInOutAnimatedView
      isVisible={props.isVisible}
      style={[styles.absoluteFill, props.style]}
    >
      <TouchableWithoutFeedback onPress={props.onRequestDismissModal}>
        <BlurView style={styles.absoluteFill} blurType="dark" blurAmount={25} />
      </TouchableWithoutFeedback>
      <BottomSheetAnimatedView
        style={styles.bottomSheet}
        isVisible={props.isVisible}
        delay={400}
      >
        {props.children}
      </BottomSheetAnimatedView>
    </FadeInOutAnimatedView>
  );
}
