// @flow

// NOTE: async because the logError API will eventually write to an
// external API like Sentry, Logstash or Google Analytics
export const log = async (message: string) => {
  // eslint-disable-next-line
  console.log(message);
};

export const logError = async (error: Error) => {
  // eslint-disable-next-line
  console.error(error);
};

export const logErrorMessage = async (errorMessage: string) => {
  // eslint-disable-next-line
  console.error(errorMessage);
};
