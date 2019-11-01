// @flow
import { RNS3 } from 'react-native-aws3';
import {
  AWS_BUCKET,
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} from 'react-native-dotenv';

export type AudioFileUploadSuccess = {
  bucket: string,
  location: string,
  key: string,
};

export async function uploadAudioFileToS3(
  audioFileURL: string
): Promise<?AudioFileUploadSuccess> {
  const file = {
    uri: audioFileURL,
    name: 'audio.m4a',
    type: 'audio/mp4',
  };
  const options = {
    acl: 'private',
    keyPrefix: 'assets/',
    bucket: AWS_BUCKET,
    region: AWS_REGION,
    accessKey: AWS_ACCESS_KEY_ID,
    secretKey: AWS_SECRET_ACCESS_KEY,
    successActionStatus: 201,
  };
  try {
    const response = await RNS3.put(file, options);
    if (response.status !== 201) {
      return null;
    }
    const { location, key } = response.body;
    return {
      bucket: AWS_BUCKET,
      location,
      key,
    };
  } catch {
    return null;
  }
}
