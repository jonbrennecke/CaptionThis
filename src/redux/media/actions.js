// @flow
import MediaManager from '../../utils/MediaManager';

export const loadVideoAssets = async (): Promise<string> => {
  return await MediaManager.getVideoAssets();
};
