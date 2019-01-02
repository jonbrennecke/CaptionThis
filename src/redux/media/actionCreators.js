// @flow
import * as Debug from '../../utils/Debug';
import { ACTION_TYPES } from './constants';
import MediaManager from '../../utils/MediaManager';
import SpeechManager from '../../utils/SpeechManager';
import * as Camera from '../../utils/Camera';
import * as VideoExportManager from '../../utils/VideoExportManager';

import type {
  Dispatch,
  ReceiveVideoAssetsPayload,
  ReceiveVideoAssetPayload,
  ReceiveSpeechTranscriptionPayload,
  ReceiveTextColorPayload,
  ReceiveBackgroundColorPayload,
  ReceiveFontFamilyPayload,
} from '../../types/redux';
import type { VideoAssetIdentifier, ColorRGBA, TextOverlayParams } from '../../types/media';
import type { SpeechTranscription } from '../../types/speech';

export const loadVideoAssets = () => {
  return async (dispatch: Dispatch<ReceiveVideoAssetsPayload>) => {
    dispatch({ type: ACTION_TYPES.DID_START_LOADING_VIDEO_ASSETS });
    try {
      const ids = await MediaManager.getVideoAssets();
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
  return async (dispatch: Dispatch<ReceiveVideoAssetPayload>) => {
    dispatch({ type: ACTION_TYPES.DID_START_SPEECH_TRANSCRIPTION });
    try {
      const success = await SpeechManager.beginSpeechTranscriptionWithVideoAsset(
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

export const beginSpeechTranscriptionWithAudioSession = () => {
  return async (dispatch: Dispatch<*>) => {
    dispatch({ type: ACTION_TYPES.DID_START_SPEECH_TRANSCRIPTION });
    try {
      const success = await SpeechManager.beginSpeechTranscriptionWithAudioSession();
      dispatch({
        type: success
          ? ACTION_TYPES.DID_SUCCESSFULLY_START_SPEECH_TRANSCRIPTION
          : ACTION_TYPES.DID_UNSUCCESSFULLY_START_SPEECH_TRANSCRIPTION,
      });
    } catch (error) {
      await Debug.logError(error);
      dispatch({
        type: ACTION_TYPES.DID_UNSUCCESSFULLY_START_SPEECH_TRANSCRIPTION,
      });
    }
  };
};

export const endSpeechTranscriptionWithAudioSession = () => {
  return async (dispatch: Dispatch<*>) => {
    dispatch({ type: ACTION_TYPES.DID_START_ENDING_SPEECH_TRANSCRIPTION });
    try {
      const success = await SpeechManager.endSpeechTranscriptionWithAudioSession();
      dispatch({
        type: success
          ? ACTION_TYPES.DID_SUCCESSFULLY_END_SPEECH_TRANSCRIPTION
          : ACTION_TYPES.DID_UNSUCCESSFULLY_END_SPEECH_TRANSCRIPTION,
      });
    } catch (error) {
      await Debug.logError(error);
      dispatch({
        type: ACTION_TYPES.DID_UNSUCCESSFULLY_END_SPEECH_TRANSCRIPTION,
      });
    }
  };
};

export const beginCameraCapture = () => {
  return async (dispatch: Dispatch<*>) => {
    dispatch({ type: ACTION_TYPES.DID_START_CAMERA_CAPTURE });
    try {
      const success = await Camera.startCapture();
      if (!success) {
        dispatch({
          type: ACTION_TYPES.DID_UNSUCCESSFULLY_START_CAMERA_CAPTURE,
        });
        return;
      }
      dispatch({
        type: ACTION_TYPES.DID_SUCCESSFULLY_START_CAMERA_CAPTURE,
      });
    } catch (error) {
      await Debug.logError(error);
      dispatch({
        type: ACTION_TYPES.DID_UNSUCCESSFULLY_START_CAMERA_CAPTURE,
      });
    }
  };
};

export const endCameraCapture = () => {
  return async (dispatch: Dispatch<*>) => {
    dispatch({ type: ACTION_TYPES.DID_STOP_CAMERA_CAPTURE });
    try {
      Camera.stopCapture();
      dispatch({
        type: ACTION_TYPES.DID_SUCCESSFULLY_STOP_CAMERA_CAPTURE,
      });
    } catch (error) {
      await Debug.logError(error);
      dispatch({
        type: ACTION_TYPES.DID_UNSUCCESSFULLY_STOP_CAMERA_CAPTURE,
      });
    }
  };
};

export const receiveFinishedVideo = (
  videoAssetIdentifier: VideoAssetIdentifier
) => {
  return (dispatch: Dispatch<ReceiveVideoAssetPayload>) => {
    dispatch({
      type: ACTION_TYPES.DID_RECEIVE_FINISHED_VIDEO,
      payload: { videoAssetIdentifier },
    });
  };
};

export const receiveSpeechTranscriptionSuccess = (
  videoAssetIdentifier: VideoAssetIdentifier,
  transcription: SpeechTranscription
) => {
  return (dispatch: Dispatch<ReceiveSpeechTranscriptionPayload>) => {
    dispatch({
      type: ACTION_TYPES.DID_SUCCESSFULLY_RECEIVE_SPEECH_TRANSCRIPTION,
      payload: { videoAssetIdentifier, transcription },
    });
  };
};

export const receiveSpeechTranscriptionFailure = (
  videoAssetIdentifier: VideoAssetIdentifier
) => {
  return (dispatch: Dispatch<ReceiveVideoAssetPayload>) => {
    dispatch({
      type: ACTION_TYPES.DID_UNSUCCESSFULLY_RECEIVE_SPEECH_TRANSCRIPTION,
      payload: { videoAssetIdentifier },
    });
  };
};

export const receiveUserSelectedFontFamily = (fontFamily: string) => {
  return (dispatch: Dispatch<ReceiveFontFamilyPayload>) => {
    dispatch({
      type: ACTION_TYPES.DID_SUCCESSFULLY_RECEIVE_FONT_FAMILY,
      payload: { fontFamily },
    });
  };
};

export const receiveUserSelectedBackgroundColor = (
  backgroundColor: ColorRGBA
) => {
  return (dispatch: Dispatch<ReceiveBackgroundColorPayload>) => {
    dispatch({
      type: ACTION_TYPES.DID_SUCCESSFULLY_RECEIVE_BACKGROUND_COLOR,
      payload: { backgroundColor },
    });
  };
};

export const receiveUserSelectedTextColor = (textColor: ColorRGBA) => {
  return (dispatch: Dispatch<ReceiveTextColorPayload>) => {
    dispatch({
      type: ACTION_TYPES.DID_SUCCESSFULLY_RECEIVE_TEXT_COLOR,
      payload: { textColor },
    });
  };
};

export const exportVideo = (video: VideoAssetIdentifier, textParamsArray: TextOverlayParams[]) => {
  return async (dispatch: Dispatch<*>) => {
    dispatch({ type: ACTION_TYPES.WILL_EXPORT_VIDEO });
    try {
      await VideoExportManager.exportVideo(video, textParamsArray)
      dispatch({
        type: ACTION_TYPES.DID_SUCCESSFULLY_EXPORT_VIDEO,
      });
    } catch (error) {
      await Debug.logError(error);
      dispatch({
        type: ACTION_TYPES.DID_NOT_SUCCESSFULLY_EXPORT_VIDEO,
      });
    }
  };
};