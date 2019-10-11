// @flow
import React from 'react';
import { View } from 'react-native';

import { isLandscape } from '../../utils/Orientation';

import type { Orientation, Size, SFC, Style, Children } from '../../types';

type VideoCaptionsContainerProps = {
  style?: ?Style,
  renderChildren: Size => Children,
  orientation?: Orientation,
  videoDimensions: Size,
  videoPlayerParentViewSize: Size,
};

const CAPTION_VIEW_HEIGHT_PORTRAIT = 85;
const CAPTION_VIEW_OFFSET_FROM_BOTTOM = 75;

const styles = {
  captionsWrap: (orientation: Orientation, videoPlayerParentViewSize: Size, videoDimensions: Size) => {
    const pixelSize = pixelSizeForCaptionView(orientation, videoPlayerParentViewSize, videoDimensions);
    if (isLandscape(orientation)) {
      const aspectRatio = videoDimensions.height / videoDimensions.width;
      const videoPlayerViewHeight = videoPlayerParentViewSize.width * aspectRatio;
      const bottomOfVideo = (videoPlayerParentViewSize.height - videoPlayerViewHeight) / 2;
      const heightRatio = videoPlayerViewHeight / videoPlayerParentViewSize.height;
      return {
        position: 'absolute',
        left: 0,
        right: 0,
        height: pixelSize.height,
        bottom: bottomOfVideo + CAPTION_VIEW_OFFSET_FROM_BOTTOM * heightRatio,
        backgroundColor: 'red',
      };
    } else {
      return {
        position: 'absolute',
        left: 0,
        right: 0,
        height: pixelSize.height,
        bottom: 0,
      };
    }
  },
};

function pixelSizeForCaptionView(orientation: Orientation, videoPlayerParentViewSize: Size, videoDimensions: Size): Size {
  if (isLandscape(orientation)) {
    const aspectRatio = videoDimensions.height / videoDimensions.width;
    const videoPlayerViewHeight = videoPlayerParentViewSize.width * aspectRatio;
    const heightRatio = videoPlayerViewHeight / videoPlayerParentViewSize.height;
    return {
      width: videoPlayerParentViewSize.width,
      height: CAPTION_VIEW_HEIGHT_PORTRAIT * heightRatio,
    };
  }
  return {
    width: videoPlayerParentViewSize.width,
    height: CAPTION_VIEW_HEIGHT_PORTRAIT,
  };
}

export const VideoCaptionsContainer: SFC<VideoCaptionsContainerProps> = ({
  style,
  renderChildren,
  orientation = 'up',
  videoDimensions,
  videoPlayerParentViewSize,
}: VideoCaptionsContainerProps) => {
  const pixelSize = pixelSizeForCaptionView(orientation, videoPlayerParentViewSize, videoDimensions);
  return (
    <View
      style={[styles.captionsWrap(orientation, videoPlayerParentViewSize, videoDimensions), style]}
    >
      {renderChildren(pixelSize)}
    </View>
  );
}
