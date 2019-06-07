// @flow
import { ACTION_TYPES } from './constants';
import { getCaptionStyle } from './selectors';

import type {
  Dispatch,
  GetState,
  ReceiveCaptionStylePayload,
} from '../../types/redux';
import type { CaptionStyleObject } from '../../types/video';

export const updateCaptionStyle = (
  partialCaptionStyle: $Shape<CaptionStyleObject>
) => {
  return (
    dispatch: Dispatch<ReceiveCaptionStylePayload>,
    getState: GetState
  ) => {
    const captionStyle = getCaptionStyle(getState());
    dispatch(
      setCaptionStyle({
        ...captionStyle,
        ...partialCaptionStyle,
      })
    );
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
