// @flow
import { transformRgbaObjectForNativeBridge } from './Color';

import type { CaptionStyleObject } from '../types';

export function makeCaptionStyleForNativeBridge(
  captionStyle: CaptionStyleObject,
  backgroundHeight: number
) {
  return {
    wordStyle: captionStyle.wordStyle,
    backgroundStyle: {
      styleType: captionStyle.backgroundStyle,
      backgroundColor: transformRgbaObjectForNativeBridge(
        captionStyle.backgroundColor
      ),
      backgroundHeight,
    },
    lineStyle: {
      styleType: captionStyle.lineStyle,
      fadeInOutProperties: {
        numberOfLines: 2,
        padding: {
          vertical: 1.3,
        },
      },
    },
    textStyle: {
      font: {
        fontFamily: captionStyle.fontFamily,
        pointSize: captionStyle.fontSize,
      },
      color: transformRgbaObjectForNativeBridge(captionStyle.textColor),
      shadow: {
        opacity: 0.5,
        color: transformRgbaObjectForNativeBridge({
          red: 0,
          green: 0,
          blue: 0,
          alpha: 1,
        }),
      },
      alignment: captionStyle.textAlignment,
    },
  };
}
