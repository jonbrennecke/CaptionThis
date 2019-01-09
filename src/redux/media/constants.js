// @flow
import { prefixWithModuleName } from '../utils';

export const MEDIA = 'media';

export const ACTION_TYPES = prefixWithModuleName(MEDIA, [
  'DID_START_LOADING_VIDEO_ASSETS',
  'DID_SUCCESSFULLY_LOAD_VIDEO_ASSETS',
  'DID_UNSUCCESSFULLY_LOAD_VIDEO_ASSETS',
  'DID_START_SPEECH_TRANSCRIPTION',
  'DID_SUCCESSFULLY_START_SPEECH_TRANSCRIPTION',
  'DID_UNSUCCESSFULLY_START_SPEECH_TRANSCRIPTION',
  'DID_SUCCESSFULLY_RECEIVE_SPEECH_TRANSCRIPTION',
  'DID_UNSUCCESSFULLY_RECEIVE_SPEECH_TRANSCRIPTION',
  'DID_START_ENDING_SPEECH_TRANSCRIPTION',
  'DID_SUCCESSFULLY_END_SPEECH_TRANSCRIPTION',
  'DID_UNSUCCESSFULLY_END_SPEECH_TRANSCRIPTION',
  'DID_SUCCESSFULLY_RECEIVE_FONT_FAMILY',
  'DID_SUCCESSFULLY_RECEIVE_BACKGROUND_COLOR',
  'DID_SUCCESSFULLY_RECEIVE_TEXT_COLOR',
  'DID_START_CAMERA_CAPTURE',
  'DID_SUCCESSFULLY_START_CAMERA_CAPTURE',
  'DID_UNSUCCESSFULLY_START_CAMERA_CAPTURE',
  'DID_STOP_CAMERA_CAPTURE',
  'DID_SUCCESSFULLY_STOP_CAMERA_CAPTURE',
  'DID_UNSUCCESSFULLY_STOP_CAMERA_CAPTURE',
  'DID_RECEIVE_FINISHED_VIDEO',
  'WILL_EXPORT_VIDEO',
  'DID_SUCCESSFULLY_EXPORT_VIDEO',
  'DID_NOT_SUCCESSFULLY_EXPORT_VIDEO',
  'DID_SUCCESSFULLY_RECEIVE_FONT_SIZE',
]);
