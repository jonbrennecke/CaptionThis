// @flow
/* eslint flowtype/generic-spacing: 0 */
import React, { PureComponent, createRef } from 'react';
import { InteractionManager } from 'react-native';
import {
  createCameraStateHOC,
  startCameraPreview,
  addVolumeButtonListener,
} from '@jonbrennecke/react-native-camera';
import { autobind } from 'core-decorators';

import { wrapWithAppState } from './appState';

import type { ComponentType } from 'react';
import type {
  CameraStateHOCProps,
  CameraPosition,
} from '@jonbrennecke/react-native-camera';
import type { AppStateHOCProps } from './appState';
import type { ReturnType } from '../../types';

export type InitializationStatus = 'loading' | 'loaded' | 'none';

export type CameraScreenStateExtraProps = {
  cameraRef: ReturnType<typeof createRef>,
  isSwitchCameraEnabled: boolean,
  initializationStatus: InitializationStatus,
  cameraPosition: ?CameraPosition,
  switchCameraPosition: () => void,
};

export type CameraScreenState = {
  isSwitchCameraEnabled: boolean,
  cameraPosition: ?CameraPosition,
  initializationStatus: InitializationStatus,
};

export type CameraStateProps = CameraScreenStateExtraProps &
  CameraStateHOCProps &
  AppStateHOCProps;

export function wrapWithCameraState<
  PassThroughProps: Object,
  C: ComponentType<CameraStateProps & PassThroughProps>
>(WrappedComponent: C): ComponentType<PassThroughProps> {
  // $FlowFixMe
  @autobind
  class CameraScreenStateContainer extends PureComponent<
    CameraStateProps & PassThroughProps,
    CameraScreenState
  > {
    cameraRef = createRef();
    volumeButtonListener: ?ReturnType<typeof addVolumeButtonListener>;
    initInteractionHandle: ?ReturnType<
      typeof InteractionManager.runAfterInteractions
    >;
    willEnterForegroundInteractionHandle: ?ReturnType<
      typeof InteractionManager.runAfterInteractions
    >;

    state: $Exact<CameraScreenState> = {
      isSwitchCameraEnabled: false,
      cameraPosition: null,
      initializationStatus: 'none',
    };

    async componentDidMount() {
      await this.props.loadCameraPermissions();
      if (this.props.hasCameraPermissions) {
        await this.initialize();
      } else {
        this.setState({ initializationStatus: 'loaded' });
      }
    }

    componentWillUnmount() {
      if (this.volumeButtonListener) {
        this.volumeButtonListener.remove();
      }
      if (this.initInteractionHandle) {
        // $FlowFixMe
        InteractionManager.clearInteractionHandle(this.initInteractionHandle);
      }
      if (this.willEnterForegroundInteractionHandle) {
        InteractionManager.clearInteractionHandle(
          // $FlowFixMe
          this.willEnterForegroundInteractionHandle
        );
      }
    }

    async componentDidUpdate(prevProps: CameraStateProps & PassThroughProps) {
      if (this.props.hasCameraPermissions && !prevProps.hasCameraPermissions) {
        await this.initialize();
      }
      if (
        this.props.lastCapturedVideoURL &&
        this.props.lastCapturedVideoURL !== prevProps.lastCapturedVideoURL
      ) {
        await this.saveCapturedVideo(this.props.lastCapturedVideoURL);
      }

      if (this.props.appState !== prevProps.appState) {
        if (
          this.props.appState &&
          /inactive|background/.test(this.props.appState)
        ) {
          this.handleAppWillEnterBackground();
        } else {
          this.handleAppWillEnterForeground();
        }
      }
    }

    handleAppWillEnterBackground() {
      if (this.props.captureStatus === 'started') {
        this.props.stopCapture({
          saveToCameraRoll: false,
        });
      }
      this.removeVolumeButtonListener();
    }

    handleAppWillEnterForeground() {
      this.willEnterForegroundInteractionHandle = InteractionManager.runAfterInteractions(
        () => {
          if (this.state.initializationStatus === 'loaded') {
            this.addVolumeButtonListener();
          }
        }
      );
    }

    addVolumeButtonListener() {
      this.removeVolumeButtonListener();
      this.volumeButtonListener = addVolumeButtonListener(
        this.handleVolumeButtonPress
      );
    }

    removeVolumeButtonListener() {
      if (this.volumeButtonListener) {
        this.volumeButtonListener.remove();
        this.volumeButtonListener = null;
      }
    }

    initialize() {
      if (this.state.initializationStatus === 'loading') {
        return;
      }
      this.setState({
        initializationStatus: 'loading',
      });
      if (this.initInteractionHandle) {
        // $FlowFixMe
        InteractionManager.clearInteractionHandle(this.initInteractionHandle);
      }
      this.initInteractionHandle = InteractionManager.runAfterInteractions(
        async () => {
          try {
            await this.props.loadSupportedFeatures();
            this.addVolumeButtonListener();
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(error);
          } finally {
            const cameraPosition = this.getInitialCameraPosition();
            if (!cameraPosition) {
              alert('Device has no supported cameras');
            } else {
              this.setState(
                {
                  initializationStatus: 'loaded',
                  cameraPosition: cameraPosition,
                  isSwitchCameraEnabled: this.hasMultipleSupportedCameras(),
                },
                () => {
                  startCameraPreview();
                }
              );
            }
          }
        }
      );
    }

    hasMultipleSupportedCameras(): boolean {
      const cameraDeviceSupport = this.props.cameraDeviceSupport;
      if (!cameraDeviceSupport) {
        return false;
      }
      return (
        cameraDeviceSupport.hasSupportedBackCamera &&
        cameraDeviceSupport.hasSupportedBackCamera
      );
    }

    getInitialCameraPosition(): ?CameraPosition {
      const cameraDeviceSupport = this.props.cameraDeviceSupport;
      if (!cameraDeviceSupport) {
        return null;
      }
      if (
        !cameraDeviceSupport.hasSupportedFrontCamera &&
        !cameraDeviceSupport.hasSupportedBackCamera
      ) {
        return null;
      }
      return cameraDeviceSupport.hasSupportedFrontCamera ? 'front' : 'back';
    }

    handleVolumeButtonPress() {
      if (this.props.captureStatus === 'started') {
        this.props.stopCapture({
          saveToCameraRoll: false,
        });
      } else {
        this.props.startCapture({
          metadata: {
            blurAperture: this.props.blurAperture,
          },
        });
      }
    }

    async saveCapturedVideo(videoURL: string) {
      // TODO:
      // await this.props.createAssetWithVideoFileAtURL(videoURL);
    }

    switchCameraPosition = () =>
      this.setState(
        {
          cameraPosition:
            this.state.cameraPosition === 'front' ? 'back' : 'front',
        },
        () => {}
      );

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          cameraRef={this.cameraRef}
          switchCameraPosition={this.switchCameraPosition}
        />
      );
    }
  }

  const withCameraState = createCameraStateHOC(state => state.camera);
  const Component = wrapWithAppState(
    withCameraState(CameraScreenStateContainer)
  );
  const WrappedWithCameraState = props => <Component {...props} />;
  return WrappedWithCameraState;
}
