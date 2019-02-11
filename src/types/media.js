// @flow

export type Size = {
  width: number,
  height: number,
};

export type VideoAssetIdentifier = string;

export type VideoObject = {
  duration: number,
  id: VideoAssetIdentifier,
};

export type ColorRGBA = {
  red: number,
  green: number,
  blue: number,
  alpha: number,
};

export type TextOverlayParams = {
  duration: number,
  timestamp: number,
  text: string,
};

export type ImageOrientation =
  | 'left'
  | 'leftMirrored'
  | 'right'
  | 'rightMirrored'
  | 'up'
  | 'upMirrored'
  | 'down'
  | 'downMirrored';
