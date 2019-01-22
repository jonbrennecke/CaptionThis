// @flow
import Promise from 'bluebird';
import { NativeModules, NativeEventEmitter } from 'react-native';

import type { VideoAssetIdentifier } from '../types/media';
import type { Return } from '../types/util';

const { MediaLibrary: _MediaLibrary } = NativeModules;
const MediaLibrary = Promise.promisifyAll(_MediaLibrary);

const NativeMediaManagerEventEmitter = new NativeEventEmitter(_MediaLibrary);

const EVENTS = {
  DID_UPDATE_VIDEOS: 'mediaLibraryDidUpdateVideos',
};

// eslint-disable-next-line flowtype/generic-spacing
type EmitterSubscription = Return<
  typeof NativeMediaManagerEventEmitter.addListener
>;

export default class MediaManager {
  static async getVideoAssets(): Promise<VideoAssetIdentifier[]> {
    return await MediaLibrary.getVideoAssetsAsync();
  }

  static startObservingVideos(
    listener: ({ videos: [VideoAssetIdentifier] }) => void
  ) {
    MediaLibrary.beginObservingVideoAssets();
    MediaManager.addDidUpdateVideosListener(listener);
  }

  static stopObservingVideos() {
    MediaLibrary.stopObservingVideoAssets();
    MediaManager.removeAllDidUpdateVideosListeners();
  }

  static addDidUpdateVideosListener(
    listener: ({ videos: [VideoAssetIdentifier] }) => void
  ): EmitterSubscription {
    return NativeMediaManagerEventEmitter.addListener(
      EVENTS.DID_UPDATE_VIDEOS,
      listener
    );
  }

  static removeAllDidUpdateVideosListeners() {
    return NativeMediaManagerEventEmitter.removeAllListeners(
      EVENTS.DID_UPDATE_VIDEOS
    );
  }
}
