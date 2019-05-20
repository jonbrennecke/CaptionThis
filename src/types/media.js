// @flow

export type Size = {
  width: number,
  height: number,
};

export type Point = {
  x: number,
  y: number,
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

// TODO rename `TextOverlayParams`
export type TextSegmentObject = TextOverlayParams;

export type Orientation =
  | 'left'
  | 'leftMirrored'
  | 'right'
  | 'rightMirrored'
  | 'up'
  | 'upMirrored'
  | 'down'
  | 'downMirrored';
