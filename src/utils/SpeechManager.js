// @flow
import Promise from 'bluebird';
import { NativeModules } from 'react-native';

import type { VideoAssetIdentifier } from '../types/media';

const { SpeechManager: _SpeechManager } = NativeModules;
const NativeSpeechManager = Promise.promisifyAll(_SpeechManager);

export default class SpeechManager {
  static async beginSpeechTranscriptionWithVideoAsset(
    videoAssetIdentifier: VideoAssetIdentifier
  ): Promise<boolean> {
    return await NativeSpeechManager.beginSpeechTranscriptionWithLocalIdentifierAsync(
      videoAssetIdentifier
    );
  }
}
