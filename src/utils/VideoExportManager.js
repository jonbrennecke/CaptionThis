// @flow
import { NativeModules, NativeEventEmitter } from 'react-native';
import Promise from 'bluebird';

import * as Debug from './Debug';
import * as Color from './Color';
import { isLandscape } from './Orientation';

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
    captionStyle,
    viewSize,
    orientation,
    ...etc
  }: ExportParams) {
    const exportParams = {
      ...etc,
      orientation,
      captionStyle: {
        ...captionStyle,
        viewSize,
        fontSize: exportFontSize(captionStyle.fontSize, viewSize, orientation),
        textColor: Color.transformRgbaObjectForNativeBridge(
          captionStyle.textColor
        ),
        backgroundColor: Color.transformRgbaObjectForNativeBridge(
          captionStyle.backgroundColor
        ),
      },
    };
    Debug.log(
      `Exporting video. Params = ${JSON.stringify(exportParams, null, 2)}`
    );
    await NativeVideoExportModule.exportVideoAsync(exportParams);
  }
}

const exportFontSize = (
  fontSize: number,
  viewSize: Size,
  orientation: Orientation
): number =>
  isLandscape(orientation)
    ? fontSize * (viewSize.height / viewSize.width)
    : fontSize;
