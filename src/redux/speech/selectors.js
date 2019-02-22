// @flow
import { TRANSCRIPTION_STATE } from '../../constants';

import type { AppState } from '../../types/redux';
import type { SpeechTranscription } from '../../types/speech';
import type { VideoAssetIdentifier } from '../../types/media';

export function didSpeechRecognitionFail(state: AppState): boolean {
  return state.speech.speechTranscriptionState === TRANSCRIPTION_STATE.FAILED;
}

export function getSpeechTranscriptions(
  state: AppState
): Map<VideoAssetIdentifier, SpeechTranscription> {
  return state.speech.speechTranscriptions;
}

export function getSpeechTranscriptionsWithKey(
  state: AppState,
  key: VideoAssetIdentifier
): ?SpeechTranscription {
  return state.speech.speechTranscriptions.get(key);
}

export function getLocale(
  state: AppState
): ?string {
  return state.speech.localeIdentifier;
}
