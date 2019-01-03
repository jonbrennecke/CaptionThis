// @flow
import { NativeModules } from 'react-native';
import Promise from 'bluebird';

import * as Debug from './Debug';

import type {
  VideoAssetIdentifier,
  TextOverlayParams,
  ColorRGBA,
} from '../types/media';

const MAX_CHARACTERS_PER_LINE = 25;

const { VideoExport: _NativeVideoExportModule } = NativeModules;
const NativeVideoExportModule = Promise.promisifyAll(_NativeVideoExportModule);

export type ExportParams = {
  video: VideoAssetIdentifier,
  textColor: ColorRGBA,
  backgroundColor: ColorRGBA,
  textSegments: TextOverlayParams[],
  fontFamily: string,
};

export const exportVideo = async ({
  textSegments,
  textColor,
  backgroundColor,
  ...etcParams
}: ExportParams) => {
  const exportSegments: TextOverlayParams[] = [];
  textSegments.forEach(segment => {
    if (!exportSegments.length) {
      exportSegments.push(segment);
      return;
    }
    const lastExportParams = exportSegments[exportSegments.length - 1];
    if (lastExportParams.text.length < MAX_CHARACTERS_PER_LINE) {
      lastExportParams.text += ` ${segment.text}`;
      lastExportParams.duration += segment.duration;
      return;
    }
    exportSegments.push(segment);
  });
  const exportParams = {
    ...etcParams,
    textColor: convertColorForNativeBridge(textColor),
    backgroundColor: convertColorForNativeBridge(backgroundColor),
    textSegments: exportSegments,
  };
  Debug.log(`Exporting video. Params = ${JSON.stringify(exportParams)}`);
  await NativeVideoExportModule.exportVideoAsync(exportParams);
};

function convertColorForNativeBridge(
  color: ColorRGBA
): [number, number, number, number] {
  return [color.red / 255, color.green / 255, color.blue / 255, color.alpha];
}
