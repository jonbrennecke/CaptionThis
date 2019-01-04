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
};
