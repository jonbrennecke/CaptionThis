// @flow
import { ACTION_TYPES } from './constants';
import { getCaptionStyle } from './selectors';

import type { Dispatch, GetState, ReceiveCaptionStylePayload } from '../../types/redux';
import type { ColorRGBA } from '../../types/media';
import type {
  CaptionStyleObject,
  CaptionBackgroundStyle,
  CaptionWordStyle,
  CaptionLineStyle,
  CaptionTextAlignment,
} from '../../types/video';

export const setFontSize = (fontSize: number) => {
  return (dispatch: Dispatch<ReceiveCaptionStylePayload>) => {
    dispatch(setPartialCaptionStyle({ fontSize }));
  };
};

export const setFontFamily = (fontFamily: string) => {
  return (dispatch: Dispatch<ReceiveCaptionStylePayload>) => {
    dispatch(setPartialCaptionStyle({ fontFamily }));
  };
};

export const setTextAlignment = (textAlignment: CaptionTextAlignment) => {
  return (dispatch: Dispatch<ReceiveCaptionStylePayload>) => {
    dispatch(setPartialCaptionStyle({ textAlignment }));
  };
};

export const setLineStyle = (lineStyle: CaptionLineStyle) => {
  return (dispatch: Dispatch<ReceiveCaptionStylePayload>) => {
    dispatch(setPartialCaptionStyle({ lineStyle }));
  };
};

export const setWordStyle = (wordStyle: CaptionWordStyle) => {
  return (dispatch: Dispatch<ReceiveCaptionStylePayload>) => {
    dispatch(setPartialCaptionStyle({ wordStyle }));
  };
};

export const setBackgroundStyle = (backgroundStyle: CaptionBackgroundStyle) => {
  return (dispatch: Dispatch<ReceiveCaptionStylePayload>) => {
    dispatch(setPartialCaptionStyle({ backgroundStyle }));
  };
};

export const setTextColor = (textColor: ColorRGBA) => {
  return (dispatch: Dispatch<ReceiveCaptionStylePayload>) => {
    dispatch(setPartialCaptionStyle({ textColor }));
  };
};

export const setBackgroundColor = (backgroundColor: ColorRGBA) => {
  return (dispatch: Dispatch<ReceiveCaptionStylePayload>) => {
    dispatch(setPartialCaptionStyle({ backgroundColor }));
  };
};

export const setPartialCaptionStyle = (partialCaptionStyle: $Shape<CaptionStyleObject>) => {
  return (dispatch: Dispatch<ReceiveCaptionStylePayload>, getState: GetState) => {
    const captionStyle = getCaptionStyle(getState());
    dispatch(setCaptionStyle({
      ...captionStyle,
      ...partialCaptionStyle,
    }));
  };
};


export const setCaptionStyle = (captionStyle: CaptionStyleObject) => {
  return (dispatch: Dispatch<ReceiveCaptionStylePayload>) => {
    dispatch({
      type: ACTION_TYPES.DID_RECEIVE_CAPTION_STYLE,
      payload: { captionStyle },
    });
  };
};
