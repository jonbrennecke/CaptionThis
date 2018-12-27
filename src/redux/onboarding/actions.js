// @flow
import Promise from 'bluebird';
import { NativeModules } from 'react-native';

const { Permissons: _Permissons } = NativeModules;

const Permissons = Promise.promisifyAll(_Permissons);

export const arePermissionsGranted = async (): Promise<boolean> => {
  return await Permissons.arePermissionsGrantedAsync();
};

export const requestAppPermissions = async (): Promise<boolean> => {
  return await Permissons.requestAppPermissionsAsync();
};
