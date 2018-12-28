// @flow
import { prefixWithModuleName } from '../utils';

export const MEDIA = 'media';

export const ACTION_TYPES = prefixWithModuleName(MEDIA, [
  'DID_START_LOADING_VIDEO_ASSETS',
  'DID_SUCCESSFULLY_LOAD_VIDEO_ASSETS',
  'DID_UNSUCCESSFULLY_LOAD_VIDEO_ASSETS',
]);
