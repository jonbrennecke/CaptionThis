// @flow
import { NativeModules, NativeEventEmitter } from 'react-native';

import type { Return } from '../types/util';

const { MediaLibrary } = NativeModules;
const MediaLibraryEmitter = new NativeEventEmitter(MediaLibrary);

type EmitterSubscription = Return<typeof MediaLibraryEmitter.addListener>;

type Size = {
  width: number,
  height: number,
};

export default class MediaManager {
  static sharedSubscription: ?EmitterSubscription = null;

  static requestVideoThumbails(targetSize: Size) {
    MediaLibrary.requestVideoThumbailsForTargetSize(targetSize);
    MediaManager.sharedSubscription = MediaLibraryEmitter.addListener(
      'mediaLibraryDidOutputThumbnail',
      (...args) => {
        console.log('MediaLibraryDidOutputThumbnail', args);
      }
    );
  }

  static removeVideoThumbnailListener() {
    MediaLibrary.sharedSubscription.remove();
  }
}
