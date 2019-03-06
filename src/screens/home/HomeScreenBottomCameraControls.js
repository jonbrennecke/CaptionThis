// @flow
import React, { Component } from 'react';
import { View } from 'react-native';

import CaptureButton from '../../components/capture-button/CaptureButton';
import SwitchCameraButton from '../../components/switch-camera-button/SwitchCameraButton';
import HomeScreenCameraRollButton from './HomeScreenCameraRollButton';
import HomeScreenPresetStylesBottomSheet from './HomeScreenPresetStylesBottomSheet';
import SlideUpAnimatedView from '../../components/animations/SlideUpAnimatedView';
import HomeScreenPresetStylesButton from './HomeScreenPresetStylesButton';

import type { Style } from '../../types/react';
import type { VideoAssetIdentifier } from '../../types/media';
import type { PresetObject } from '../../types/video';

type Props = {
  style?: ?Style,
  isVisible: boolean,
  onRequestBeginCapture: () => void,
  onRequestEndCapture: () => void,
  onRequestOpenCameraRoll: () => void,
  onRequestSwitchCamera: () => void,
  video: ?VideoAssetIdentifier,
};

type State = {
  isPresetSheetVisible: boolean,
  preset: PresetObject,
};

const PRESET_STYLES: PresetObject[] = [
  {
    textAlignment: 'left',
    lineStyle: 'translateY',
    wordStyle: 'animated',
  },
  {
    textAlignment: 'right',
    lineStyle: 'translateY',
    wordStyle: 'animated',
  },
  {
    textAlignment: 'center',
    lineStyle: 'translateY',
    wordStyle: 'animated',
  },
  {
    textAlignment: 'center',
    lineStyle: 'fadeInOut',
    wordStyle: 'none',
  },
  {
    textAlignment: 'left',
    lineStyle: 'fadeInOut',
    wordStyle: 'none',
  },
  {
    textAlignment: 'right',
    lineStyle: 'fadeInOut',
    wordStyle: 'none',
  },
];

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    flexDirection: 'row',
    paddingHorizontal: 35,
  },
  cameraRollButton: {
    height: 37,
    width: 37,
  },
  buttonInside: {
    flex: 1,
    borderRadius: 3,
    overflow: 'hidden',
  },
  switchCameraButton: {
    height: 37,
    width: 37,
  },
  flex: {
    flex: 1,
  },
  preset: {
    height: 50,
    flex: 1,
  },
  leftSideButtons: {
    flex: 1,
  },
  rightSideButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 25,
  },
  captionPresetButton: {
    height: 37,
    width: 37,
  },
};

export default class HomeScreenBottomCameraControls extends Component<
  Props,
  State
> {
  state = {
    isPresetSheetVisible: false,
    preset: PRESET_STYLES[0],
  };

  render() {
    return (
      <SlideUpAnimatedView
        style={[styles.container, this.props.style]}
        isVisible={this.props.isVisible}
        delay={1000}
      >
        <View style={styles.leftSideButtons}>
          <HomeScreenCameraRollButton
            id={this.props.video}
            onPress={this.props.onRequestOpenCameraRoll}
            style={styles.cameraRollButton}
          />
        </View>
        <CaptureButton
          onRequestBeginCapture={this.props.onRequestBeginCapture}
          onRequestEndCapture={this.props.onRequestEndCapture}
        />
        <View style={styles.rightSideButtons}>
          <HomeScreenPresetStylesButton
            style={styles.captionPresetButton}
            onPress={() => this.setState({ isPresetSheetVisible: true })}
          />
          <SwitchCameraButton
            style={styles.switchCameraButton}
            onRequestSwitchCamera={this.props.onRequestSwitchCamera}
          />
        </View>
        <HomeScreenPresetStylesBottomSheet
          isVisible={this.state.isPresetSheetVisible}
          currentPreset={this.state.preset}
          presets={PRESET_STYLES}
          onRequestSelectPreset={preset => this.setState({ preset })}
        />
      </SlideUpAnimatedView>
    );
  }
}
