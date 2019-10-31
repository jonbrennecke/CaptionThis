// @flow
import Bluebird from 'bluebird';
import { NativeModules } from 'react-native';

const { HSAudioExportBridgeModule } = NativeModules;

const NativeAudioExportBridgeModule = Bluebird.promisifyAll(HSAudioExportBridgeModule);

export async function createAudioFile(assetID: string): Promise<string> {
  const audioFileURL = await NativeAudioExportBridgeModule.createAudioFileAsync(assetID);
  return audioFileURL;
}
