// @flow
/* eslint flowtype/generic-spacing: 0 */
import React, { PureComponent, createRef } from 'react';
import { InteractionManager } from 'react-native';
import {
  createCameraStateHOC,
  addVolumeButtonListener,
  CameraResolutionPresets,
} from '@jonbrennecke/react-native-camera';
import { createMediaStateHOC } from '@jonbrennecke/react-native-media';
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

export type CameraScreenState = {
  isSwitchCameraEnabled: boolean,
  isCameraPaused: boolean,
  cameraPosition: ?CameraPosition,
  initializationStatus: InitializationStatus,
  cameraResolutionPreset: {
    front: $Keys<typeof CameraResolutionPresets>,
    back: $Keys<typeof CameraResolutionPresets>,
  },
};

export type CameraScreenStateExtraProps = {
  cameraRef: ReturnType<typeof createRef>,
  switchCameraPosition: () => void,
};

export type CameraStateProps = CameraStateHOCProps &
  AppStateHOCProps &
  CameraScreenStateExtraProps &
  CameraScreenState;

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
      isCameraPaused: false,
      cameraPosition: null,
      initializationStatus: 'none',
      cameraResolutionPreset: {
        front: CameraResolutionPresets.hd720p,
        back: CameraResolutionPresets.hd1080p,
      },
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
      this.removeVolumeButtonListener();
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
      // TODO: add this back when issues are fixed
      // this.removeVolumeButtonListener();
      // this.volumeButtonListener = addVolumeButtonListener(
      //   this.handleVolumeButtonPress
      // );
    }

    removeVolumeButtonListener() {
      // TODO: add this back when issues are fixed
      // if (this.volumeButtonListener) {
      //   this.volumeButtonListener.remove();
      //   this.volumeButtonListener = null;
      // }
    }

    initialize() {
      if (this.state.initializationStatus === 'loading') {
        return;
      }
      this.setState({
        initializationStatus: 'loading',
        isCameraPaused: true,
      });
      if (this.initInteractionHandle) {
        // $FlowFixMe
        InteractionManager.clearInteractionHandle(this.initInteractionHandle);
      }
      this.initInteractionHandle = InteractionManager.runAfterInteractions(
        async () => {
          try {
            await this.props.loadSupportedFeatures();

            // TODO: set this.state.cameraResolutionPreset with the best preset option
            // Currently, the "bestFormat" always returns 4K, even if this isn't supported on the camera.
            // const supportedFormats = await getSupportedFormats(false, this.state.cameraPosition || 'front');
            // const videoFormats = supportedFormats
            //   .filter(fmt => fmt.mediaType === 'vide')
            //   .filter(fmt => fmt.dimensions.width >= 1280);
            // const bestFormats = maxBy(videoFormats, fmt => fmt.dimensions.width);

            this.addVolumeButtonListener();
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(error);
          } finally {
            this.setState({
              initializationStatus: 'loaded',
              cameraPosition: 'front',
              isSwitchCameraEnabled: this.hasMultipleSupportedCameras(),
              isCameraPaused: false,
            });
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

    switchCameraPosition = () =>
      this.setState(
        {
          isCameraPaused: true,
        },
        () => {
          this.setState({
            isCameraPaused: false,
            cameraPosition:
              this.state.cameraPosition === 'front' ? 'back' : 'front',
          });
        }
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

  const withMediaState = createMediaStateHOC(state => state.newMedia);
  const withCameraState = createCameraStateHOC(state => state.camera);
  const Component = wrapWithAppState(
    withMediaState(withCameraState(CameraScreenStateContainer))
  );
  const WrappedWithCameraState = props => <Component {...props} />;
  return WrappedWithCameraState;
}
