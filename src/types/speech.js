// @flow
export type SpeechTranscriptionSegment = {
  duration: number,
  timestamp: number,
  confidence: number,
  substring: string,
  alternativeSubstrings: string[],
};

export type SpeechTranscription = {
  isFinal: boolean,
  formattedString: string,
  segments: SpeechTranscriptionSegment[],
  locale: LocaleObject,
};

export type LocaleObject = {
  language: {
    code: string,
    localizedStrings: {
      languageLocale: string,
      currentLocale: string,
    },
  },
  country: {
    code: string,
    localizedStrings: {
      languageLocale: string,
      currentLocale: string,
    },
  },
};
