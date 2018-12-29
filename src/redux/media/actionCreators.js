// @flow
import * as actions from './actions';
import * as Debug from '../../utils/Debug';
import { ACTION_TYPES } from './constants';

import type { Dispatch } from '../../types/redux';
import type { VideoAssetIdentifier } from '../../types/media';

export const loadVideoAssets = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: ACTION_TYPES.DID_START_LOADING_VIDEO_ASSETS });
    try {
      const ids = await actions.loadVideoAssets();
      dispatch({
        type: ACTION_TYPES.DID_SUCCESSFULLY_LOAD_VIDEO_ASSETS,
        payload: {
          videoAssetIdentifiers: ids,
        },
      });
    } catch (error) {
      await Debug.logError(error);
      dispatch({ type: ACTION_TYPES.DID_UNSUCCESSFULLY_LOAD_VIDEO_ASSETS });
    }
  };
};

export const beginSpeechTranscriptionWithVideoAsset = (
  videoAssetIdentifier: VideoAssetIdentifier
) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: ACTION_TYPES.DID_START_SPEECH_TRANSCRIPTION });
    try {
      const success = await actions.beginSpeechTranscriptionWithVideoAsset(
        videoAssetIdentifier
      );
      if (!success) {
        dispatch({
          type: ACTION_TYPES.DID_UNSUCCESSFULLY_START_SPEECH_TRANSCRIPTION,
        });
      }
      dispatch({
        type: ACTION_TYPES.DID_SUCCESSFULLY_START_SPEECH_TRANSCRIPTION,
        payload: { videoAssetIdentifier },
      });
    } catch (error) {
      await Debug.logError(error);
      dispatch({
        type: ACTION_TYPES.DID_UNSUCCESSFULLY_START_SPEECH_TRANSCRIPTION,
      });
    }
  };
};
