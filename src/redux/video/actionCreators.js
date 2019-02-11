// @flow
import { ACTION_TYPES } from './constants';

import type {
  Dispatch,
  ReceiveTextColorPayload,
  ReceiveBackgroundColorPayload,
  ReceiveFontFamilyPayload,
  ReceiveFontSizePayload,
} from '../../types/redux';
import type { ColorRGBA } from '../../types/media';

export const receiveUserSelectedFontSize = (fontSize: number) => {
  return (dispatch: Dispatch<ReceiveFontSizePayload>) => {
    dispatch({
      type: ACTION_TYPES.DID_RECEIVE_FONT_SIZE,
      payload: { fontSize },
    });
  };
};

export const receiveUserSelectedFontFamily = (fontFamily: string) => {
  return (dispatch: Dispatch<ReceiveFontFamilyPayload>) => {
    dispatch({
      type: ACTION_TYPES.DID_RECEIVE_FONT_FAMILY,
      payload: { fontFamily },
    });
  };
};

export const receiveUserSelectedBackgroundColor = (
  backgroundColor: ColorRGBA
) => {
  return (dispatch: Dispatch<ReceiveBackgroundColorPayload>) => {
    dispatch({
      type: ACTION_TYPES.DID_RECEIVE_BACKGROUND_COLOR,
      payload: { backgroundColor },
    });
  };
};

export const receiveUserSelectedTextColor = (textColor: ColorRGBA) => {
  return (dispatch: Dispatch<ReceiveTextColorPayload>) => {
    dispatch({
      type: ACTION_TYPES.DID_RECEIVE_TEXT_COLOR,
      payload: { textColor },
    });
  };
};
