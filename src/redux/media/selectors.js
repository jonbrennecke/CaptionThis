// @flow
import { LOADING_STATE } from '../../constants';

import type { AppState } from '../../types/redux';
import type { VideoAssetIdentifier, ColorRGBA } from '../../types/media';
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

export function getFontFamily(state: AppState): string {
  return state.media.fontFamily;
}

export function getBackgroundColor(state: AppState): ColorRGBA {
  return state.media.backgroundColor;
}

export function getTextColor(state: AppState): ColorRGBA {
  return state.media.textColor;
}

export function isCameraRecording(state: AppState): boolean {
  return state.media.cameraRecordingState.isRecording;
}

export function getCurrentVideo(state: AppState): ?VideoAssetIdentifier {
  return state.media.cameraRecordingState.videoAssetIdentifier;
}

export function isExportingVideo(state: AppState): boolean {
  return state.media.videoExportState === LOADING_STATE.IS_LOADING;
}
