// @flow
import { NativeModules, NativeEventEmitter } from 'react-native';
import Promise from 'bluebird';

import { isLandscape } from './Orientation';
import { makeCaptionStyleForNativeBridge } from './captionStyleUtils';

import type {
  Size,
  VideoAssetIdentifier,
  Orientation,
  TextSegmentObject,
} from '../types/media';
import type { CaptionStyleObject } from '../types/video';
import type { Return } from '../types/util';

const { VideoExport: _NativeVideoExportModule } = NativeModules;
const NativeVideoExportModule = Promise.promisifyAll(_NativeVideoExportModule);
const NativeVideoExportManagerEventEmitter = new NativeEventEmitter(
  _NativeVideoExportModule
);

// eslint-disable-next-line flowtype/generic-spacing
export type EmitterSubscription = Return<
  typeof NativeVideoExportManagerEventEmitter.addListener
>;

const EVENTS = {
  DID_FINISH_EXPORT: 'videoExportManagerDidFinish',
  DID_FAIL: 'videoExportManagerDidFail',
  DID_UPDATE_PROGRESS: 'videoExportManagerDidDidUpdateProgress',
};

const captionViewHeight = 85;
const captionViewOffsetFromBottom = 75;

export type ExportParams = {
  viewSize: Size,
  video: VideoAssetIdentifier,
  duration: number,
  captionStyle: CaptionStyleObject,
  textSegments: TextSegmentObject[],
  orientation: Orientation,
  dimensions: Size,
};

export default class VideoExportManager {
  static addDidFinishListener(listener: () => void): EmitterSubscription {
    return NativeVideoExportManagerEventEmitter.addListener(
      EVENTS.DID_FINISH_EXPORT,
      listener
    );
  }

  static addDidFailListener(listener: () => void): EmitterSubscription {
    return NativeVideoExportManagerEventEmitter.addListener(
      EVENTS.DID_FAIL,
      listener
    );
  }

  static addDidUpdateProgressListener(
    listener: (progress: number) => void
  ): EmitterSubscription {
    return NativeVideoExportManagerEventEmitter.addListener(
      EVENTS.DID_UPDATE_PROGRESS,
      ({ progress }: { progress: number }) => {
        listener(progress);
      }
    );
  }

  static async exportVideo({
    dimensions,
    captionStyle,
    viewSize,
    orientation,
    ...etc
  }: ExportParams) {
    const exportParams = {
      ...etc,
      orientation,
      viewSize,
      captionStyle: makeCaptionStyleForNativeBridge(
        {
          ...captionStyle,
          fontSize: exportFontSize(
            captionStyle.fontSize,
            viewSize,
            dimensions,
            orientation
          ),
          textColor: captionStyle.textColor,
          backgroundColor: captionStyle.backgroundColor,
        },
        exportBackgroundHeight(dimensions, viewSize, orientation)
      ),
    };
    await NativeVideoExportModule.exportVideoAsync(exportParams);
  }
}

const exportFontSize = (
  fontSize: number,
  viewSize: Size,
  dimensions: Size,
  orientation: Orientation
): number => {
  const heightRatio = isLandscape(orientation)
    ? (dimensions.height / viewSize.height) * 16 / 9
    : dimensions.width / viewSize.height;
  return fontSize * heightRatio;
};

const exportBackgroundHeight = (
  dimensions: Size,
  viewSize: Size,
  orientation: Orientation
): number => {
  const heightRatio = isLandscape(orientation)
    ? dimensions.height / viewSize.height
    : dimensions.width / viewSize.height;
  return (captionViewHeight + captionViewOffsetFromBottom) * heightRatio;
};
