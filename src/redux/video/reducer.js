// @flow
import { handleActions } from 'redux-actions';
import { ACTION_TYPES } from './constants';
import { FONT_FAMILIES, TEXT_COLORS } from '../../constants';
import * as Color from '../../utils/Color';

import type {
  Action,
  VideoState,
  ReceiveFontFamilyPayload,
  ReceiveBackgroundColorPayload,
  ReceiveTextColorPayload,
  ReceiveFontSizePayload,
} from '../../types/redux';

const DEFAULT_FONT_FAMILY = FONT_FAMILIES.RUBIK;
const DEFAULT_BACKGROUND_COLOR = Color.transparent;
const DEFAULT_TEXT_COLOR = Color.hexToRgbaObject(TEXT_COLORS.WHITE);
const DEFAULT_FONT_SIZE = 20;

const initialState: VideoState = {
  fontFamily: DEFAULT_FONT_FAMILY,
  fontSize: DEFAULT_FONT_SIZE,
  backgroundColor: DEFAULT_BACKGROUND_COLOR,
  textColor: DEFAULT_TEXT_COLOR,
  lineStyle: 'twoLines',
};

const actions = {
  [ACTION_TYPES.DID_RECEIVE_FONT_FAMILY]: didReceiveFontFamily,
  [ACTION_TYPES.DID_RECEIVE_BACKGROUND_COLOR]: didReceiveBackgroundColor,
  [ACTION_TYPES.DID_RECEIVE_TEXT_COLOR]: didReceiveTextColor,
  [ACTION_TYPES.DID_RECEIVE_FONT_SIZE]: didReceiveFontSize,
};

function didReceiveFontFamily(
  state: VideoState,
  { payload }: Action<ReceiveFontFamilyPayload>
): VideoState {
  if (!payload) {
    return state;
  }
  return {
    ...state,
    fontFamily: payload.fontFamily,
  };
}

function didReceiveBackgroundColor(
  state: VideoState,
  { payload }: Action<ReceiveBackgroundColorPayload>
): VideoState {
  if (!payload) {
    return state;
  }
  return {
    ...state,
    backgroundColor: payload.backgroundColor,
  };
}

function didReceiveTextColor(
  state: VideoState,
  { payload }: Action<ReceiveTextColorPayload>
): VideoState {
  if (!payload) {
    return state;
  }
  return {
    ...state,
    textColor: payload.textColor,
  };
}

function didReceiveFontSize(
  state: VideoState,
  { payload }: Action<ReceiveFontSizePayload>
): VideoState {
  if (!payload) {
    return state;
  }
  return {
    ...state,
    fontSize: payload.fontSize,
  };
}

export default handleActions(actions, initialState);