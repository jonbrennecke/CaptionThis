// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import * as Camera from '../../utils/Camera';
import { requireOnboardedUser } from '../../utils/Onboarding';
import { arePermissionsGranted } from '../../redux/onboarding/selectors';
import CameraPreviewView from '../../components/camera-preview-view/CameraPreviewView';

import type { AppState } from '../../types/redux';

type OwnProps = {};

type StateProps = {
  arePermissionsGranted: boolean,
};

type DispatchProps = {};

type Props = OwnProps & StateProps & DispatchProps;

const styles = {
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.OFF_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: Fonts.getFontStyle('heading'),
  cameraPreview: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
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
      this.startCameraPreview();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.arePermissionsGranted && this.props.arePermissionsGranted) {
      this.startCameraPreview();
    }
  }

  startCameraPreview() {
    Camera.startPreview();
  }

  render() {
    return (
      <View style={styles.container}>
        <CameraPreviewView style={styles.cameraPreview} />
      </View>
    );
  }
}
