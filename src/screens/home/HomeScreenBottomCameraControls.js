// @flow
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import uuid from 'uuid';
import { autobind } from 'core-decorators';

import CaptureButton from '../../components/capture-button/CaptureButton';
import SwitchCameraButton from '../../components/switch-camera-button/SwitchCameraButton';
import HomeScreenCameraRollButton from './HomeScreenCameraRollButton';
import HomeScreenPresetStyles from './HomeScreenPresetStyles';
import SlideUpAnimatedView from '../../components/animations/SlideUpAnimatedView';
import CaptionView from '../../components/caption-view/CaptionView';
import { PRESET_STYLES } from './presets';

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

const FIXED_DURATION = 1000;

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
  captions: {
    width: '100%',
    height: 85,
  },
  cameraRollButton: {
    height: 37,
    width: 37,
  },
  switchCameraButton: {
    height: 37,
    width: 37,
  },
  flex: {
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
  captionViewContainer: {
    flex: 1,
  },
};

// $FlowFixMe
@autobind
export default class HomeScreenBottomCameraControls extends PureComponent<
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
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.captionViewContainer}>
          <CaptionView
            style={styles.captions}
            duration={FIXED_DURATION}
            textSegments={transformTextSegments(
              this.props.textSegments,
              FIXED_DURATION
            )}
            captionStyle={this.props.captionStyle}
            backgroundHeight={275}
          />
        </View>
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
      </View>
    );
  }
}

const transformTextSegments = (
  textSegments: CaptionTextSegment[],
  duration: number
): CaptionTextSegment[] => {
  return textSegments.map(segment => ({
    ...segment,
    duration: duration,
    timestamp: 0,
  }));
};
