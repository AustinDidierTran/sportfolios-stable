const { LOGGER_ENUM } = require('../../../../common/enums');

const enabledEnums = [LOGGER_ENUM];

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

const stripeLogger = (type, ...messages) => {
  logger(LOGGER_ENUM.STRIPE, messages);
};

const stripeErrorLogger = (type, ...messages) => {
  logger(LOGGER_ENUM.STRIPE, messages, 'error');
};

module.exports = {
  stripeErrorLogger,
  stripeLogger,
};
