// @flow
export type SpeechTranscriptionSegment = {
  duration: number,
  timestamp: number,
  confidence: number,
  substring: string,
  alternativeSubstrings: string[],
};

export type SpeechTranscription = {
  formattedString: string,
  segments: SpeechTranscriptionSegment[],
};
