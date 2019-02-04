// @flow
import React, { Component } from 'react';
import {
  requireNativeComponent,
  View,
  Text,
  NativeModules,
  StyleSheet,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';

import type { Style } from '../../types/react';

const NativeCameraPreviewView = requireNativeComponent('CameraPreview');
const { CameraPreviewManager } = NativeModules;

type ReactNativeFiberHostComponent = any;

type Props = {
  style?: ?Style,
};

const styles = {
  previewView: {
    backgroundColor: UI_COLORS.DARK_GREY,
    ...StyleSheet.absoluteFill
  },
  text: Fonts.getFontStyle('default', { contentStyle: 'lightContent' }),
};

export default class CameraPreviewView extends Component<Props> {
  nativeComponentRef: ?ReactNativeFiberHostComponent;

  focusOnPoint(focusPoint: { x: number, y: number }) {
    if (!this.nativeComponentRef) {
      return;
    }
    CameraPreviewManager.focusOnPoint(
      this.nativeComponentRef._nativeTag,
      focusPoint
    );
  }

  setUp() {
    if (!this.nativeComponentRef) {
      return;
    }
    CameraPreviewManager.setUp(this.nativeComponentRef._nativeTag);
  }

  render() {
    if (DeviceInfo.isEmulator()) {
      return (
        <View style={[styles.previewView, this.props.style]}>
          <Text style={styles.text}>Camera preview placeholder</Text>
        </View>
      );
    }
    return (
      <NativeCameraPreviewView
        style={[styles.previewView, this.props.style]}
        ref={ref => {
          this.nativeComponentRef = ref;
        }}
      />
    );
  }
}
