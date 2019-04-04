// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import uuid from 'uuid';

import { UI_COLORS, USER_BACKGROUND_COLOR_CHOICES } from '../../constants';
import * as Color from '../../utils/Color';
import CaptureButton from '../../components/capture-button/CaptureButton';
import SwitchCameraButton from '../../components/switch-camera-button/SwitchCameraButton';
import HomeScreenCameraRollButton from './HomeScreenCameraRollButton';
import HomeScreenPresetStyles from './HomeScreenPresetStyles';
import SlideUpAnimatedView from '../../components/animations/SlideUpAnimatedView';

import type { Style } from '../../types/react';
import type { VideoAssetIdentifier } from '../../types/media';
import type { CaptionPresetStyleObject } from '../../types/video';

type CaptionPresetStyleObjectWithId = CaptionPresetStyleObject & { id: string };

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
  preset: CaptionPresetStyleObjectWithId,
};

const PRESET_STYLES: CaptionPresetStyleObject[] = [
  {
    textAlignment: 'left',
    lineStyle: 'translateY',
    wordStyle: 'animated',
    backgroundStyle: 'gradient',
    backgroundColor: Color.hexToRgbaObject(UI_COLORS.DARK_GREY),
  },
  {
    textAlignment: 'center',
    lineStyle: 'translateY',
    wordStyle: 'animated',
    backgroundStyle: 'gradient',
    backgroundColor: Color.hexToRgbaObject(UI_COLORS.MEDIUM_RED),
  },
  {
    textAlignment: 'left',
    lineStyle: 'translateY',
    wordStyle: 'none',
    backgroundStyle: 'gradient',
    backgroundColor: Color.hexToRgbaObject(UI_COLORS.DARK_GREY),
  },
  {
    textAlignment: 'center',
    lineStyle: 'fadeInOut',
    wordStyle: 'none',
    backgroundStyle: 'solid',
    backgroundColor: Color.hexToRgbaObject(USER_BACKGROUND_COLOR_CHOICES[1]),
  },
  {
    textAlignment: 'left',
    lineStyle: 'fadeInOut',
    wordStyle: 'none',
    backgroundStyle: 'solid',
    backgroundColor: Color.Constants.transparent,
  },
  {
    textAlignment: 'center',
    lineStyle: 'fadeInOut',
    wordStyle: 'none',
    backgroundStyle: 'solid',
    backgroundColor: Color.Constants.transparent,
  },
];

const PRESET_STYLES_WITH_ID: CaptionPresetStyleObjectWithId[] = PRESET_STYLES.map(
  p => ({
    id: uuid.v4(),
    ...p,
  })
);

const styles = {
  container: {},
  rowWrap: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    flexDirection: 'row',
    paddingTop: 35,
    paddingHorizontal: 35,
    paddingBottom: 5,
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  rightSideButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
    isPresetSheetVisible: true,
    preset: PRESET_STYLES_WITH_ID[0],
  };

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <SlideUpAnimatedView
          style={styles.rowWrap}
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
            <SwitchCameraButton
              style={styles.switchCameraButton}
              onRequestSwitchCamera={this.props.onRequestSwitchCamera}
            />
          </View>
        </SlideUpAnimatedView>
        <HomeScreenPresetStyles
          isVisible={this.state.isPresetSheetVisible}
          presets={PRESET_STYLES_WITH_ID}
          currentPreset={this.state.preset}
          onRequestSelectPreset={preset => this.setState({ preset })}
        />
      </View>
    );
  }
}
