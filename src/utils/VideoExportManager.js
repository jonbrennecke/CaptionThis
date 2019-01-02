// @flow
import { NativeModules } from 'react-native';
import Promise from 'bluebird';

import type { VideoAssetIdentifier, TextOverlayParams } from '../types/media';

const { VideoExport: _NativeVideoExportModule } = NativeModules;
const NativeVideoExportModule = Promise.promisifyAll(_NativeVideoExportModule);

export const exportVideo = async (
  video: VideoAssetIdentifier,
  paramsArray: TextOverlayParams[]
) => {
  await NativeVideoExportModule.exportVideoAsync(video, paramsArray);
};
