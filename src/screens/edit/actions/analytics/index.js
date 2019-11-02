// @flow
import { createAudioFile } from './audioFileExport';
import { uploadAudioFileToS3 } from './audioFileUpload';
import { postSpeechTranscription } from './postSpeechTranscription';

import type { SpeechTranscription } from '@jonbrennecke/react-native-speech';

export async function logSpeechTranscriptionAnalytics(
  assetID: string,
  speechTranscription: SpeechTranscription
) {
  const audioFileURL = await createAudioFile(assetID);
  if (!audioFileURL) {
    return;
  }
  const uploadedAudioFile = await uploadAudioFileToS3(audioFileURL, 'm4a');
  if (!uploadedAudioFile) {
    return;
  }
  await postSpeechTranscription(audioFileURL, speechTranscription);
}
