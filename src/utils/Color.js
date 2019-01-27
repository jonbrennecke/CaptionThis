// @flow
import hex2rgb from 'hex2rgb';

import type { ColorRGBA } from '../types/media';

export function hexToRgbaString(hex: string, alpha?: number = 1): string {
  const [r, g, b] = hex2rgb(hex).rgb;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function hexToRgbaObject(hex: string, alpha?: number = 1): ColorRGBA {
  const [red, green, blue] = hex2rgb(hex).rgb;
  return { red, green, blue, alpha };
}

export function rgbaObjectToRgbaString(rgba: ColorRGBA): string {
  const { red, green, blue, alpha } = rgba;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export const transparent: ColorRGBA = { red: 0, green: 0, blue: 0, alpha: 0 };