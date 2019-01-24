// @flow
import { NativeModules } from 'react-native';
import Promise from 'bluebird';

import * as Debug from './Debug';

import type {
  VideoAssetIdentifier,
  TextOverlayParams,
  ColorRGBA,
} from '../types/media';
import type { LineStyle } from '../types/video';

const { VideoExport: _NativeVideoExportModule } = NativeModules;
const NativeVideoExportModule = Promise.promisifyAll(_NativeVideoExportModule);

export type ExportParams = {
  video: VideoAssetIdentifier,
  fontSize: number,
  textColor: ColorRGBA,
  backgroundColor: ColorRGBA,
  textSegments: TextOverlayParams[],
  fontFamily: string,
  duration: number,
  lineStyle: LineStyle,
};

export const exportVideo = async ({
  textSegments,
  textColor,
  backgroundColor,
  ...etcParams
}: ExportParams) => {
  const exportParams = {
    ...etcParams,
    textSegments,
    textColor: convertColorForNativeBridge(textColor),
    backgroundColor: convertColorForNativeBridge(backgroundColor),
  };
  Debug.log(`Exporting video. Params = ${JSON.stringify(exportParams)}`);
  await NativeVideoExportModule.exportVideoAsync(exportParams);
};

function convertColorForNativeBridge(
  color: ColorRGBA
): [number, number, number, number] {
  return [color.red / 255, color.green / 255, color.blue / 255, color.alpha];
}
