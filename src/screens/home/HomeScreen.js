// @flow
import React, { Component } from 'react';
import { View, ScrollView, SafeAreaView, Dimensions, Text } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import * as Camera from '../../utils/Camera';
import * as Screens from '../../utils/Screens';
import { requireOnboardedUser } from '../../utils/Onboarding';
import { arePermissionsGranted } from '../../redux/onboarding/selectors';
import { loadVideoAssets } from '../../redux/media/actionCreators';
import { getVideoAssetIdentifiers } from '../../redux/media/selectors';
import CameraPreviewView from '../../components/camera-preview-view/CameraPreviewView';
import VideoThumbnailGrid from '../../components/video-thumbnail-grid/VideoThumbnailGrid';
import ScreenGradients from '../../components/screen-gradients/ScreenGradients';

import type { Dispatch, AppState } from '../../types/redux';
import type { VideoAssetIdentifier } from '../../types/media';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

type OwnProps = {
  componentId: string,
};

type StateProps = {
  videoAssetIdentifiers: VideoAssetIdentifier[],
  arePermissionsGranted: boolean,
};

type DispatchProps = {
  loadVideoAssets: () => Promise<any>,
};

type Props = OwnProps & StateProps & DispatchProps;

const styles = {
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.BLACK,
  },
  cameraPreview: {
    borderRadius: 10,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 125,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  safeAreaContents: {
    flex: 1,
  },
  mediaWrap: {
    flex: 1,
  },
  mediaHeader: {
    paddingVertical: 5,
    alignItems: 'center',
  },
  mediaText: Fonts.getFontStyle('title', { contentStyle: 'lightContent' }),
  thumbnailGrid: {
    flex: 1,
  },
};

function mapStateToProps(state: AppState): StateProps {
  return {
    videoAssetIdentifiers: getVideoAssetIdentifiers(state),
    arePermissionsGranted: arePermissionsGranted(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    loadVideoAssets: () => dispatch(loadVideoAssets()),
  };
}

// $FlowFixMe
@requireOnboardedUser
@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class HomeScreen extends Component<Props> {
  componentDidMount() {
    if (this.props.arePermissionsGranted) {
      this.setupAfterOnboarding();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.arePermissionsGranted && this.props.arePermissionsGranted) {
      this.setupAfterOnboarding();
    }
  }

  async setupAfterOnboarding() {
    Camera.startPreview();
    await this.props.loadVideoAssets();
  }

  async onDidPressVideoThumbnail(identifier: VideoAssetIdentifier) {
    await Screens.pushEditScreen(this.props.componentId, identifier);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScreenGradients />
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentInsetAdjustmentBehavior="automatic"
          overScrollMode="always"
          alwaysBounceVertical
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.safeAreaContents}>
              <CameraPreviewView style={styles.cameraPreview} />
              <View style={styles.mediaWrap}>
                <View style={styles.mediaHeader}>
                  <Text style={styles.mediaText}>VIDEOS</Text>
                </View>
                <VideoThumbnailGrid
                  style={styles.thumbnailGrid}
                  videoAssetIdentifiers={this.props.videoAssetIdentifiers}
                  onPressThumbnail={(...args) => {
                    this.onDidPressVideoThumbnail(...args);
                  }}
                />
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
    );
  }
}
