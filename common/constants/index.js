const { MILLIS_TIME_ENUM } = require('../enums');

const EXPIRATION_TIMES = {
  EMAIL_CONFIRMATION_TOKEN: MILLIS_TIME_ENUM.ONE_HOUR,
  PERSON_TRANSFER_TOKEN: MILLIS_TIME_ENUM.ONE_WEEK,
  ACCOUNT_RECOVERY_TOKEN: MILLIS_TIME_ENUM.ONE_HOUR,
  AUTH_TOKEN: MILLIS_TIME_ENUM.ONE_WEEK,
};

module.exports = { EXPIRATION_TIMES };
