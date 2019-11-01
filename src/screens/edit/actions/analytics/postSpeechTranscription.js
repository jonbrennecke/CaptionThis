// @flow
import {
  BREVITY_HOST,
  BREVITY_PORT,
  BREVITY_PROTOCOL,
} from 'react-native-dotenv';
import { getLocaleID } from '@jonbrennecke/react-native-speech';

import { postRequest } from '../../../../utils/Request';

import type { SpeechTranscription } from '@jonbrennecke/react-native-speech';

const brevityURL = makeBrevityURL();

function makeBrevityURL(): string {
  return `${BREVITY_PROTOCOL}://${BREVITY_HOST}:${BREVITY_PORT}`;
}

export async function postSpeechTranscription(
  audioFileURL: string,
  speechTranscription: SpeechTranscription
): Promise<boolean> {
  const substrings = speechTranscription.segments.map(s => ({
    substring: s.substring,
    timestamp: s.timestamp,
    confidence: s.confidence,
    duration: s.duration,
  }));
  try {
    const result = await postRequest({
      url: `${brevityURL}/speechTranscriptions`,
      body: {
        audioFileURL,
        locale: getLocaleID(speechTranscription.locale),
        substrings,
      },
    });
    return result.status >= 200 && result.status < 300;
  } catch {
    return false;
  }
}
