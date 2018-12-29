// @flow
import MediaManager from '../../utils/MediaManager';
import SpeechManager from '../../utils/SpeechManager';

import type { VideoAssetIdentifier } from '../../types/media';

export const loadVideoAssets = async (): Promise<string> => {
  return await MediaManager.getVideoAssets();
};

export const beginSpeechTranscriptionWithVideoAsset = async (
  videoAssetIdentifier: VideoAssetIdentifier
): Promise<void> => {
  return await SpeechManager.beginSpeechTranscriptionWithVideoAsset(
    videoAssetIdentifier
  );
};
