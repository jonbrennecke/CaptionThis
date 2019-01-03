// @flow
import { NativeModules } from 'react-native';
import Promise from 'bluebird';

import * as Debug from './Debug';

import type { VideoAssetIdentifier, TextOverlayParams } from '../types/media';

const MAX_CHARACTERS_PER_LINE = 25;

const { VideoExport: _NativeVideoExportModule } = NativeModules;
const NativeVideoExportModule = Promise.promisifyAll(_NativeVideoExportModule);

export const exportVideo = async (
  video: VideoAssetIdentifier,
  paramsArray: TextOverlayParams[]
) => {
  const exportParams: TextOverlayParams[] = [];
  paramsArray.forEach(params => {
    if (!exportParams.length) {
      exportParams.push(params);
      return;
    }
    const lastExportParams = exportParams[exportParams.length - 1];
    if (lastExportParams.text.length < MAX_CHARACTERS_PER_LINE) {
      lastExportParams.text += ` ${params.text}`;
      lastExportParams.duration += params.duration;
      return;
    }
    exportParams.push(params);
  });
  Debug.log(`Exporting video. Params = ${JSON.stringify(exportParams)}`);
  await NativeVideoExportModule.exportVideoAsync(video, exportParams);
};