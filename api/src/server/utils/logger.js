import { LOGGER_ENUM } from '../../../../common/enums/index.js';

const enabledEnums = [LOGGER_ENUM.STRIPE];

const logger = (category, messages = [], type) => {
  if (enabledEnums.includes(category)) {
    messages.forEach(message => {
      const output = `${type}: ${message}`;
      if (type === 'error') {
        /* eslint-disable-next-line */
        console.error(output);
      } else {
        /* eslint-disable-next-line */
        console.info(output);
      }
    });
  }
};

const stripeLogger = (type = 'message', ...messages) => {
  logger(LOGGER_ENUM.STRIPE, messages, type);
};

const stripeErrorLogger = (type = 'error', ...messages) => {
  logger(LOGGER_ENUM.STRIPE, messages, type);
};

export {
  stripeErrorLogger,
  stripeLogger,
};
