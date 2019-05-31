// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import uuid from 'uuid';
import { autobind } from 'core-decorators';

import {
  UI_COLORS,
  USER_BACKGROUND_COLOR_CHOICES,
  USER_TEXT_COLOR_CHOICES,
  FONT_FAMILIES,
} from '../../constants';
import * as Color from '../../utils/Color';
import CaptureButton from '../../components/capture-button/CaptureButton';
import SwitchCameraButton from '../../components/switch-camera-button/SwitchCameraButton';
import HomeScreenCameraRollButton from './HomeScreenCameraRollButton';
import HomeScreenPresetStyles from './HomeScreenPresetStyles';
import SlideUpAnimatedView from '../../components/animations/SlideUpAnimatedView';
import MeasureContentsView from '../../components/measure-contents-view/MeasureContentsView';
import CaptionView from '../../components/caption-view/CaptionView';
import VideoCaptionsContainer from '../../components/video-captions-view/VideoCaptionsContainer';

import type { Style } from '../../types/react';
import type { VideoAssetIdentifier } from '../../types/media';
import type {
  CaptionStyleObject,
  CaptionPresetStyleObject,
  CaptionTextSegment,
} from '../../types/video';

type CaptionPresetStyleObjectWithId = {|
  ...CaptionPresetStyleObject,
  id: string,
|};

type Props = {
  style?: ?Style,
  isVisible: boolean,
  video: ?VideoAssetIdentifier,
  textSegments: CaptionTextSegment[],
  captionStyle: CaptionStyleObject,
  onRequestBeginCapture: () => void,
  onRequestEndCapture: () => void,
  onRequestOpenCameraRoll: () => void,
  onRequestSwitchCamera: () => void,
  onRequestSetCaptionStyle: CaptionPresetStyleObject => void,
};

type State = {
  isPresetSheetVisible: boolean,
  preset: CaptionPresetStyleObjectWithId,
};

const PRESET_STYLES: CaptionPresetStyleObject[] = [
  {
    textAlignment: 'left',
    lineStyle: 'translateY',
    wordStyle: 'none',
    backgroundStyle: 'gradient',
    backgroundColor: Color.hexToRgbaObject(UI_COLORS.BLACK),
    fontFamily: FONT_FAMILIES.RIGHTEOUS,
    textColor: Color.hexToRgbaObject(USER_TEXT_COLOR_CHOICES[0]),
  },
  {
    textAlignment: 'center',
    lineStyle: 'translateY',
    wordStyle: 'animated',
    backgroundStyle: 'gradient',
    backgroundColor: Color.hexToRgbaObject(UI_COLORS.MEDIUM_RED),
    fontFamily: FONT_FAMILIES.BANGERS,
    textColor: Color.hexToRgbaObject(USER_TEXT_COLOR_CHOICES[0]),
  },
  {
    textAlignment: 'left',
    lineStyle: 'translateY',
    wordStyle: 'none',
    backgroundStyle: 'solid',
    backgroundColor: Color.hexToRgbaObject(UI_COLORS.WHITE),
    fontFamily: FONT_FAMILIES.STAATLICHES,
    textColor: Color.hexToRgbaObject(USER_TEXT_COLOR_CHOICES[1]),
  },
  {
    textAlignment: 'center',
    lineStyle: 'translateY',
    wordStyle: 'none',
    backgroundStyle: 'gradient',
    backgroundColor: Color.hexToRgbaObject(UI_COLORS.DARK_GREY),
    fontFamily: FONT_FAMILIES.ROBOTO,
    textColor: Color.hexToRgbaObject(USER_TEXT_COLOR_CHOICES[2]),
  },
  {
    textAlignment: 'center',
    lineStyle: 'fadeInOut',
    wordStyle: 'none',
    backgroundStyle: 'solid',
    backgroundColor: Color.hexToRgbaObject(USER_BACKGROUND_COLOR_CHOICES[1]),
    fontFamily: FONT_FAMILIES.SOURCE_SANS_PRO,
    textColor: Color.hexToRgbaObject(USER_TEXT_COLOR_CHOICES[0]),
  },
  {
    textAlignment: 'left',
    lineStyle: 'fadeInOut',
    wordStyle: 'none',
    backgroundStyle: 'solid',
    backgroundColor: Color.Constants.transparent,
    fontFamily: FONT_FAMILIES.SOURCE_SANS_PRO,
    textColor: Color.hexToRgbaObject(USER_TEXT_COLOR_CHOICES[0]),
  },
  {
    textAlignment: 'center',
    lineStyle: 'fadeInOut',
    wordStyle: 'none',
    backgroundStyle: 'solid',
    backgroundColor: Color.Constants.transparent,
    fontFamily: FONT_FAMILIES.SOURCE_SANS_PRO,
    textColor: Color.hexToRgbaObject(USER_TEXT_COLOR_CHOICES[0]),
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
    flexDirection: 'row',
    paddingTop: 25,
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

// $FlowFixMe
@autobind
export default class HomeScreenBottomCameraControls extends Component<
  Props,
  State
> {
  state = {
    isPresetSheetVisible: true,
    preset: PRESET_STYLES_WITH_ID[0],
  };

  presetPickerDidSelectPreset({
    id,
    ...preset
  }: CaptionPresetStyleObjectWithId) {
    this.setState({ preset: { id, ...preset } });
    this.props.onRequestSetCaptionStyle(preset);
  }

  render() {
    const captionViewLayout = ({ height, width }) => ({
      size: { width, height: height + 85 },
      origin: { x: 0, y: 0 },
    });
    return (
      <View style={[styles.container, this.props.style]}>
        <MeasureContentsView
          renderChildren={viewSize => (
            <>
              <VideoCaptionsContainer style={styles.flex}>
                <CaptionView
                  style={styles.flex}
                  duration={10}
                  textSegments={this.props.textSegments}
                  captionStyle={this.props.captionStyle}
                  viewLayout={captionViewLayout(viewSize)}
                />
              </VideoCaptionsContainer>
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
                onRequestSelectPreset={this.presetPickerDidSelectPreset}
              />
            </>
          )}
        />
      </View>
    );
  }
}
