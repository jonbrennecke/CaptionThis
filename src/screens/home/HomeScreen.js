// @flow
import React, { Component } from 'react';
import { View, ScrollView, SafeAreaView, Dimensions, Text } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import * as Camera from '../../utils/Camera';
import MediaManager from '../../utils/MediaManager';
import { requireOnboardedUser } from '../../utils/Onboarding';
import { arePermissionsGranted } from '../../redux/onboarding/selectors';
import CameraPreviewView from '../../components/camera-preview-view/CameraPreviewView';

import type { AppState } from '../../types/redux';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type OwnProps = {};

type StateProps = {
  arePermissionsGranted: boolean,
};

type DispatchProps = {};

type Props = OwnProps & StateProps & DispatchProps;

const styles = {
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.BLACK,
  },
  cameraPreview: {
    flex: 1,
    borderRadius: 10,
    maxHeight: SCREEN_HEIGHT - 125,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContents: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  safeAreaContents: {
    flex: 1,
  },
  mediaWrap: {
    alignItems: 'center',
    paddingTop: 5,
  },
  mediaText: Fonts.getFontStyle('title', { contentStyle: 'lightContent' }),
};

function mapStateToProps(state: AppState): StateProps {
  return {
    arePermissionsGranted: arePermissionsGranted(state),
  };
}

function mapDispatchToProps(): DispatchProps {
  return {};
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

  componentWillUnmount() {
    MediaManager.removeVideoThumbnailListener();
  }

  setupAfterOnboarding() {
    Camera.startPreview();
    MediaManager.requestVideoThumbails({ width: 300, height: 300 });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContents}
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
                <Text style={styles.mediaText}>VIDEOS</Text>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
    );
  }
}
