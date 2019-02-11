// @flow
import Promise from 'bluebird';
import { NativeModules } from 'react-native';

const { DeviceBridgeModule: _NativeDeviceModule } = NativeModules;
const NativeDeviceModule = Promise.promisifyAll(_NativeDeviceModule);

export type DeviceInfoObject = {
  isMemoryLimitedDevice: boolean,
};

export const getDeviceInfo = async (): Promise<DeviceInfoObject> => {
  const isMemoryLimitedDevice = await NativeDeviceModule.isMemoryLimitedDeviceAsync();
  return {
    isMemoryLimitedDevice,
  };
};
