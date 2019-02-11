// @flow
import { LOADING_STATE } from '../../constants';

import type { AppState } from '../../types/redux';
import type { VideoAssetIdentifier, VideoObject } from '../../types/media';

export function getVideos(state: AppState): VideoObject[] {
  return state.media.videos;
}

export function isLoadingMedia(state: AppState): boolean {
  return state.media.mediaLoadingState === LOADING_STATE.IS_LOADING;
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
