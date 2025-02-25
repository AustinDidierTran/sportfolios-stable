import { MILLIS_TIME_ENUM } from '../enums/index.js';

export const EXPIRATION_TIMES = {
  EMAIL_CONFIRMATION_TOKEN: MILLIS_TIME_ENUM.ONE_HOUR,
  PERSON_TRANSFER_TOKEN: MILLIS_TIME_ENUM.ONE_WEEK,
  ACCOUNT_RECOVERY_TOKEN: MILLIS_TIME_ENUM.ONE_HOUR,
  AUTH_TOKEN: MILLIS_TIME_ENUM.ONE_WEEK,
  IMPORT_MEMBER: MILLIS_TIME_ENUM.ONE_MONTH,
};
