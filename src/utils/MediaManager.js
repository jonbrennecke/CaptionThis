// @flow
import Promise from 'bluebird';
import { NativeModules } from 'react-native';

import type { VideoAssetIdentifier } from '../types/media';

const { MediaLibrary: _MediaLibrary } = NativeModules;
const MediaLibrary = Promise.promisifyAll(_MediaLibrary);

export default class MediaManager {
  static async getVideoAssets(): Promise<VideoAssetIdentifier[]> {
    return await MediaLibrary.getVideoAssetsAsync();
  }
}
