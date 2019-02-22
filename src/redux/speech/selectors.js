// @flow
import { TRANSCRIPTION_STATE } from '../../constants';
import { getLocaleID } from '../../utils/Localization';

import type { AppState } from '../../types/redux';
import type { SpeechTranscription, LocaleObject } from '../../types/speech';
import type { VideoAssetIdentifier } from '../../types/media';

export function didSpeechRecognitionFail(state: AppState): boolean {
  return state.speech.speechTranscriptionState === TRANSCRIPTION_STATE.FAILED;
}

export function getSpeechTranscriptions(
  state: AppState
): Map<VideoAssetIdentifier, SpeechTranscription> {
  return state.speech.speechTranscriptions;
}

export function getSpeechTranscriptionByID(
  state: AppState,
  id: VideoAssetIdentifier
): ?SpeechTranscription {
  if (!state.speech.speechTranscriptions.has(id)) {
    return null;
  }
  return state.speech.speechTranscriptions.get(id);
}

export function getLocale(state: AppState): ?LocaleObject {
  return state.speech.locale;
}

export function isSpeechTranscriptionFinal(
  state: AppState,
  videoID: VideoAssetIdentifier
): boolean {
  const speechTranscription = getSpeechTranscriptionByID(state, videoID);
  const currentLocale = state.speech.locale;
  if (!speechTranscription || !currentLocale) {
    return false;
  }
  const hasFinalizedTranscription = !!(
    speechTranscription && speechTranscription.isFinal
  );
  const hasLocale =
    getLocaleID(speechTranscription.locale) === getLocaleID(currentLocale);
  return hasFinalizedTranscription && hasLocale;
}
