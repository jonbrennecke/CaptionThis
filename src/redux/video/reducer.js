// @flow
import { handleActions } from 'redux-actions';
import { ACTION_TYPES } from './constants';
import { FONT_FAMILIES, TEXT_COLORS } from '../../constants';
import * as Color from '../../utils/Color';

import type {
  Action,
  VideoState,
  ReceiveCaptionStylePayload,
} from '../../types/redux';

const initialState: VideoState = {
  captionStyle: {
    fontFamily: FONT_FAMILIES.RUBIK,
    fontSize: 20,
    backgroundColor: Color.transparent,
    textColor: Color.hexToRgbaObject(TEXT_COLORS.WHITE),
    textAlignment: 'left',
    lineStyle: 'translateUp',
    wordStyle: 'none',
    backgroundStyle: 'gradient',
  },
};

const actions = {
  [ACTION_TYPES.DID_RECEIVE_CAPTION_STYLE]: didReceiveCaptionStyle,
};

function didReceiveCaptionStyle(
  state: VideoState,
  { payload }: Action<ReceiveCaptionStylePayload>
): VideoState {
  if (!payload) {
    return state;
  }
  return {
    ...state,
    captionStyle: payload.captionStyle,
  };
}

export default handleActions(actions, initialState);
