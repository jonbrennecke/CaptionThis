// @flow
import Promise from 'bluebird';
import { NativeModules, NativeEventEmitter } from 'react-native';

import type { VideoAssetIdentifier } from '../types/media';
import type { Return } from '../types/util';
import type { SpeechTranscription } from '../types/speech';

const { SpeechManager: _SpeechManager } = NativeModules;
const NativeSpeechManager = Promise.promisifyAll(_SpeechManager);
const NativeSpeechManagerEventEmitter = new NativeEventEmitter(_SpeechManager);

// eslint-disable-next-line flowtype/generic-spacing
export type EmitterSubscription = Return<
  typeof NativeSpeechManagerEventEmitter.addListener
>;

const EVENTS = {
  DID_RECEIVE_SPEECH_TRANSCRIPTION:
    'speechManagerDidReceiveSpeechTranscription',
  DID_NOT_DETECT_SPEECH: 'speechManagerDidNotDetectSpeech',
};

export default class SpeechManager {
  static addDidReceiveSpeechTranscriptionListener(
    listener: (transcription: SpeechTranscription) => void
  ): EmitterSubscription {
    return NativeSpeechManagerEventEmitter.addListener(
      EVENTS.DID_RECEIVE_SPEECH_TRANSCRIPTION,
      listener
    );
  }

  static addDidNotDetectSpeechListener(
    listener: () => void
  ): EmitterSubscription {
    return NativeSpeechManagerEventEmitter.addListener(
      EVENTS.DID_NOT_DETECT_SPEECH,
      listener
    );
  }

  static async beginSpeechTranscriptionWithVideoAsset(
    videoAssetIdentifier: VideoAssetIdentifier
  ): Promise<boolean> {
    return await NativeSpeechManager.beginSpeechTranscriptionWithLocalIdentifierAsync(
      videoAssetIdentifier
    );
  }

  static async beginSpeechTranscriptionWithAudioSession(): Promise<boolean> {
    return await NativeSpeechManager.beginSpeechTranscriptionWithAudioSessionAsync();
  }

  static async endSpeechTranscriptionWithAudioSession(): Promise<boolean> {
    return await NativeSpeechManager.endSpeechTranscriptionWithAudioSessionAsync();
  }
}
