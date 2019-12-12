// @flow
import { NativeModules, NativeEventEmitter } from 'react-native';
import Promise from 'bluebird';

import { makeCaptionStyleForNativeBridge } from './captionStyleUtils';
import { normalizeVideoDimensions, exportFontSize, exportBackgroundHeight} from './exportUtils';

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
    dimensions: inputDimensions,
    captionStyle,
    viewSize,
    orientation,
    ...etc
  }: ExportParams) {
    const dimensions = normalizeVideoDimensions(inputDimensions, orientation);
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
        exportBackgroundHeight(dimensions, viewSize)
      ),
    };
    await NativeVideoExportModule.exportVideoAsync(exportParams);
  }
}
