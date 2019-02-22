// @flow
import { Sentry } from 'react-native-sentry';

// NOTE: async because the logError API will eventually write to an
// external API like Sentry, Logstash or Google Analytics
export const log = async (message: string) => {
  // eslint-disable-next-line
  console.log(message);
};

export const logError = async (error: Error) => {
  Sentry.captureException(error);
  // eslint-disable-next-line
  console.error(error);
};

export const logErrorMessage = async (errorMessage: string) => {
  // eslint-disable-next-line
  console.error(errorMessage);
};

export const logWarningMessage = async (warningMessage: string) => {
  // eslint-disable-next-line
  console.warn(warningMessage);
};
