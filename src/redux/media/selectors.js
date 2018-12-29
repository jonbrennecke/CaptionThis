// @flow
import { LOADING_STATE } from '../../constants';

import type { AppState } from '../../types/redux';
import type { VideoAssetIdentifier } from '../../types/media';
import type { SpeechTranscription } from '../../types/speech';

export function getVideoAssetIdentifiers(
  state: AppState
): VideoAssetIdentifier[] {
  return state.media.videoAssetIdentifiers;
}

export function isLoadingMedia(state: AppState): boolean {
  return state.media.mediaLoadingState === LOADING_STATE.IS_LOADING;
}

export function getSpeechTranscriptions(
  state: AppState
): Map<VideoAssetIdentifier, SpeechTranscription> {
  return state.media.speechTranscriptions;
}

export function getSpeechTranscriptionsWithKey(
  state: AppState,
  key: VideoAssetIdentifier
): ?SpeechTranscription {
  return state.media.speechTranscriptions.get(key);
}
