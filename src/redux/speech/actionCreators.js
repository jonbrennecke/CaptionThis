// @flow
import * as Debug from '../../utils/Debug';
import { ACTION_TYPES } from './constants';
import SpeechManager from '../../utils/SpeechManager';

import type {
  Dispatch,
  ReceiveVideoAssetIdPayload,
  ReceiveSpeechTranscriptionPayload,
  ReceiveLocalePayload,
} from '../../types/redux';
import type { VideoAssetIdentifier } from '../../types/media';
import type { SpeechTranscription, LocaleObject } from '../../types/speech';

export const beginSpeechTranscriptionWithVideoAsset = (
  videoAssetIdentifier: VideoAssetIdentifier
) => {
  return async (dispatch: Dispatch<ReceiveVideoAssetIdPayload>) => {
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
  return (dispatch: Dispatch<ReceiveVideoAssetIdPayload>) => {
    dispatch({
      type: ACTION_TYPES.DID_NOT_SUCCESSFULLY_RECEIVE_SPEECH_TRANSCRIPTION,
      payload: { videoAssetIdentifier },
    });
  };
};

export const loadCurrentLocale = () => {
  return async (dispatch: Dispatch<ReceiveLocalePayload>) => {
    dispatch({ type: ACTION_TYPES.WILL_SET_LOCALE });
    try {
      const currentLocale = await SpeechManager.currentLocale();
      dispatch(receiveLocale(currentLocale));
    } catch (error) {
      await Debug.logError(error);
      dispatch({
        type: ACTION_TYPES.DID_FAIL_TO_SET_LOCALE,
      });
    }
  };
};

export const setLocale = (locale: LocaleObject) => {
  return async (dispatch: Dispatch<ReceiveLocalePayload>) => {
    dispatch({ type: ACTION_TYPES.WILL_SET_LOCALE });
    try {
      const localeIdentifier = `${locale.language.code}-${locale.country.code}`;
      const success = await SpeechManager.setLocale(localeIdentifier);
      if (success) {
        dispatch(receiveLocale(locale));
        return;
      }
      dispatch({
        type: ACTION_TYPES.DID_FAIL_TO_SET_LOCALE,
      });
    } catch (error) {
      await Debug.logError(error);
      dispatch({
        type: ACTION_TYPES.DID_FAIL_TO_SET_LOCALE,
      });
    }
  };
};

export const receiveLocale = (locale: LocaleObject) => {
  return (dispatch: Dispatch<ReceiveLocalePayload>) => {
    dispatch({
      type: ACTION_TYPES.DID_SET_LOCALE,
      payload: {
        locale,
      },
    });
  };
};
