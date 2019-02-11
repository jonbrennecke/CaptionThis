// @flow
import Bluebird from 'bluebird';
import { NativeModules, NativeEventEmitter } from 'react-native';

import type { VideoAssetIdentifier } from '../types/media';
import type { Return } from '../types/util';

const { MediaLibrary: _MediaLibrary } = NativeModules;
const MediaLibrary = Bluebird.promisifyAll(_MediaLibrary);

const NativeMediaManagerEventEmitter = new NativeEventEmitter(_MediaLibrary);

const EVENTS = {
  DID_UPDATE_VIDEOS: 'mediaLibraryDidUpdateVideos',
};

// eslint-disable-next-line flowtype/generic-spacing
export type EmitterSubscription = Return<
  typeof NativeMediaManagerEventEmitter.addListener
>;

export type VideoObject = { id: VideoAssetIdentifier, duration: number };

export default class MediaManager {
  static async getVideoAssets(): Promise<VideoObject[]> {
    return await MediaLibrary.getVideosAsync();
  }

  static startObservingVideos(
    listener: ({ videos: VideoObject[] }) => void
  ): EmitterSubscription {
    MediaLibrary.startObservingVideos();
    return MediaManager.addDidUpdateVideosListener(listener);
  }

  static stopObservingVideos() {
    MediaLibrary.stopObservingVideos();
    MediaManager.removeAllDidUpdateVideosListeners();
  }

  static addDidUpdateVideosListener(
    listener: ({ videos: VideoObject[] }) => void
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
