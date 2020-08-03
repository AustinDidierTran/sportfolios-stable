const ERROR_ENUM = {
  ACCESS_DENIED: 'Access denied',
  ERROR_OCCURED: 'An error has occured',
  INVALID_TRANSIT_NUMBER:
    'Invalid transit number. The number should be in the format xxxxx-yyy or xxxxxyyy.',
  REGISTRATION_ERROR: 'There was an error with your registration',
  TOKEN_EXPIRED: 'Token has expired',
  VALUE_IS_INVALID: 'Value is invalid',
  VALUE_IS_REQUIRED: 'value_is_required',
};

const errors = {
  [ERROR_ENUM.ACCESS_DENIED]: {
    message: ERROR_ENUM.ACCESS_DENIED,
    code: 401,
  },
  [ERROR_ENUM.TOKEN_EXPIRED]: {
    message: ERROR_ENUM.TOKEN_EXPIRED,
    code: 401,
  },
  [ERROR_ENUM.INVALID_TRANSIT_NUMBER]: {
    message: ERROR_ENUM.INVALID_TRANSIT_NUMBER,
    code: 403,
  },
  [ERROR_ENUM.ERROR_OCCURED]: {
    message: ERROR_ENUM.ERROR_OCCURED,
    code: 404,
  },
  [ERROR_ENUM.VALUE_IS_INVALID]: {
    message: ERROR_ENUM.VALUE_IS_INVALID,
    code: 405,
  },
  [ERROR_ENUM.VALUE_IS_REQUIRED]: {
    message: ERROR_ENUM.VALUE_IS_REQUIRED,
    code: 406,
  },
  [ERROR_ENUM.VALUE_IS_TOO_LONG]: {
    message: ERROR_ENUM.VALUE_IS_TOO_LONG,
    code: 406,
  },
  [ERROR_ENUM.REGISTRATION_ERROR]: {
    message: ERROR_ENUM.REGISTRATION_ERROR,
    code: 411,
  },
};
module.exports = { ERROR_ENUM, errors };
