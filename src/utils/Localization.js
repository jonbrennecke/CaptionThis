// @flow
import type { LocaleObject } from '../types/speech';

export function localeIdentfier(locale: LocaleObject): string {
  return `${locale.language.code}-${locale.country.code.toUpperCase()}`;
}
