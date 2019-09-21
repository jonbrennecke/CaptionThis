// @flow
import Bluebird from 'bluebird';
import { NativeModules, NativeEventEmitter } from 'react-native';

import type { VideoAssetIdentifier } from '../types/media';
import type { Return } from '../types/util';
import type { SpeechTranscription, LocaleObject } from '../types/speech';

const { SpeechManager: _SpeechManager } = NativeModules;
const NativeSpeechManager = Bluebird.promisifyAll(_SpeechManager);
const NativeSpeechManagerEventEmitter = new NativeEventEmitter(_SpeechManager);

// eslint-disable-next-line flowtype/generic-spacing
export type EmitterSubscription = Return<
  typeof NativeSpeechManagerEventEmitter.addListener
>;

const EVENTS = {
  DID_RECEIVE_SPEECH_TRANSCRIPTION:
    'speechManagerDidReceiveSpeechTranscription',
  DID_NOT_DETECT_SPEECH: 'speechManagerDidNotDetectSpeech',
  DID_FAIL: 'speechManagerDidFail',
  DID_END: 'speechManagerDidEnd',
  DID_CHANGE_LOCALE: 'speechManagerDidChangeLocale',
  DID_BECOME_AVAILABLE: 'speechManagerDidBecomeAvailable',
  DID_BECOME_UNAVAILABLE: 'speechManagerDidBecomeUnavailable',
};

export const requestSpeechPermissions = async (): Promise<boolean> => {
  return NativeSpeechManager.requestSpeechPermissionsAsync();
};

export const hasSpeechPermissions = async (): Promise<boolean> => {
  return NativeSpeechManager.hasSpeechPermissionsAsync();
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

  static addDidFailListener(listener: () => void) {
    return NativeSpeechManagerEventEmitter.addListener(
      EVENTS.DID_FAIL,
      listener
    );
  }

  static addDidEndListener(listener: () => void) {
    return NativeSpeechManagerEventEmitter.addListener(
      EVENTS.DID_END,
      listener
    );
  }

  static addDidChangeLocaleListener(listener: (locale: LocaleObject) => void) {
    return NativeSpeechManagerEventEmitter.addListener(
      EVENTS.DID_CHANGE_LOCALE,
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

  static async supportedLocales(): Promise<LocaleObject[]> {
    return await NativeSpeechManager.getSupportedLocalesAsync();
  }

  static async currentLocale(): Promise<LocaleObject> {
    return await NativeSpeechManager.getCurrentLocaleAsync();
  }

  static async setLocale(localeIdentifier: string): Promise<boolean> {
    return await NativeSpeechManager.setLocaleAsync(localeIdentifier);
  }
}
