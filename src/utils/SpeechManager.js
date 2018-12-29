// @flow
import Promise from 'bluebird';
import { NativeModules, NativeEventEmitter } from 'react-native';

import type { VideoAssetIdentifier } from '../types/media';
import type { Return } from '../types/util';
import type { SpeechTranscription } from '../types/speech';

// eslint-disable-next-line flowtype/generic-spacing
type EmitterSubscription = Return<
  typeof NativeSpeechManagerEventEmitter.addListener
>;

const { SpeechManager: _SpeechManager } = NativeModules;
const NativeSpeechManager = Promise.promisifyAll(_SpeechManager);
const NativeSpeechManagerEventEmitter = new NativeEventEmitter(_SpeechManager);

const EVENTS = {
  DID_RECEIVE_SPEECH_TRANSCRIPTION:
    'speechManagerDidReceiveSpeechTranscription',
};

export default class SpeechManager {
  static addSpeechTranscriptionListener(
    listener: (transcription: SpeechTranscription) => void
  ): EmitterSubscription {
    return NativeSpeechManagerEventEmitter.addListener(
      EVENTS.DID_RECEIVE_SPEECH_TRANSCRIPTION,
      listener
    );
  }

  static removeListener(subscription: EmitterSubscription) {
    subscription.remove();
  }

  static async beginSpeechTranscriptionWithVideoAsset(
    videoAssetIdentifier: VideoAssetIdentifier
  ): Promise<boolean> {
    return await NativeSpeechManager.beginSpeechTranscriptionWithLocalIdentifierAsync(
      videoAssetIdentifier
    );
  }
}