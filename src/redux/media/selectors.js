// @flow
import { LOADING_STATE } from '../../constants';

import type { AppState } from '../../types/redux';
import type { VideoAssetIdentifier } from '../../types/media';

export function isCameraRecording(state: AppState): boolean {
  return state.media.isCameraRecording;
}

export function getCurrentVideo(state: AppState): ?VideoAssetIdentifier {
  return state.media.recordedVideoID;
}

export function isExportingVideo(state: AppState): boolean {
  return state.media.videoExportState === LOADING_STATE.IS_LOADING;
}
