// @flow
import { LOADING_STATE } from '../../constants';

import type { AppState } from '../../types/redux';
import type { VideoAssetIdentifier } from '../../types/media';

export function getVideoAssetIdentifiers(
  state: AppState
): VideoAssetIdentifier[] {
  return state.media.videoAssetIdentifiers;
}

export function isLoadingMedia(state: AppState): boolean {
  return state.media.mediaLoadingState === LOADING_STATE.IS_LOADING;
}
