// @flow
import { NativeModules, NativeEventEmitter } from 'react-native';
import Promise from 'bluebird';

import * as Debug from './Debug';

import type {
  VideoAssetIdentifier,
  TextOverlayParams,
  ColorRGBA,
  ImageOrientation,
} from '../types/media';
import type { LineStyle } from '../types/video';
import type { Return } from '../types/util';

const { VideoExport: _NativeVideoExportModule } = NativeModules;
const NativeVideoExportModule = Promise.promisifyAll(_NativeVideoExportModule);
const NativeVideoExportManagerEventEmitter = new NativeEventEmitter(_NativeVideoExportModule);

// eslint-disable-next-line flowtype/generic-spacing
export type EmitterSubscription = Return<
  typeof NativeVideoExportManagerEventEmitter.addListener
>;

const EVENTS = {
  DID_FINISH_EXPORT: 'videoExportManagerDidFinish',
  DID_FAIL: 'videoExportManagerDidFail',
};

export type ExportParams = {
  video: VideoAssetIdentifier,
  fontSize: number,
  textColor: ColorRGBA,
  backgroundColor: ColorRGBA,
  textSegments: TextOverlayParams[],
  fontFamily: string,
  duration: number,
  lineStyle: LineStyle,
  orientation: ImageOrientation,
};

export default class VideoExportManager {
  static addDidFinishListener(
    listener: () => void
  ): EmitterSubscription {
    return NativeVideoExportManagerEventEmitter.addListener(
      EVENTS.DID_FINISH_EXPORT,
      listener
    );
  }

  static addDidFailListener(
    listener: () => void
  ): EmitterSubscription {
    return NativeVideoExportManagerEventEmitter.addListener(
      EVENTS.DID_FAIL,
      listener
    );
  }

  // TODO removeDidFinishListener

  static async exportVideo({
    textSegments,
    textColor,
    backgroundColor,
    ...etcParams
  }: ExportParams) {
    const exportParams = {
      ...etcParams,
      textSegments,
      textColor: convertColorForNativeBridge(textColor),
      backgroundColor: convertColorForNativeBridge(backgroundColor),
    };
    Debug.log(`Exporting video. Params = ${JSON.stringify(exportParams, null, 2)}`);
    await NativeVideoExportModule.exportVideoAsync(exportParams);
  }

}

function convertColorForNativeBridge(
  color: ColorRGBA
): [number, number, number, number] {
  return [color.red / 255, color.green / 255, color.blue / 255, color.alpha];
}
