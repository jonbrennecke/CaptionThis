// @flow
import { NativeModules } from 'react-native';
import Promise from 'bluebird';

import type { VideoAssetIdentifier } from '../types/media';

const { VideoExport: _NativeVideoExportModule } = NativeModules;
const NativeVideoExportModule = Promise.promisifyAll(_NativeVideoExportModule);

export type TextOverlayParams = {
  duration: number,
  timestamp: number,
  text: string,
};

export const exportVideo = async (
  video: VideoAssetIdentifier,
  paramsArray: TextOverlayParams[]
) => {
  NativeVideoExportModule.exportVideoAsync(video, paramsArray);
};
