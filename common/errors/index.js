const ERROR_ENUM = {
  ACCESS_DENIED: 'Access denied',
  CLOSE_AFTER_OPEN: 'error_close_date_before_start_date',
  EMAIL_ALREADY_EXIST: 'email_already_exist',
  ERROR_OCCURED: 'An error has occured',
  FORBIDDEN: 'Forbidden',
  INVALID_EMAIL: 'invalid_email',
  INVALID_INFORMATION: 'invalid_information',
  INVALID_TRANSIT_NUMBER:
    'Invalid transit number. The number should be in the format xxxxx-yyy or xxxxxyyy.',
  REGISTRATION_ERROR: 'There was an error with your registration',
  REMOVE_LAST_CAPTAIN:
    'Team must have at least one coach, captain or assistant captain',
  REMOVE_PAID_PLAYER: 'Not allowed to remove player that has paid',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_IS_INVALID: 'Token is invalid,',
  UNCONFIRMED_EMAIL: 'Unconfirmed email',
  UNREGISTRATION_ERROR:
    'There was an error with your unregistration or the refund',
  VALUE_ALREADY_EXISTS: 'Value already exist',
  VALUE_IS_INVALID: 'value_is_invalid',
  VALUE_IS_REQUIRED: 'value_is_required',
  VALUE_IS_TOO_LONG: 'value_is_too_long',

  NEW_PASSWORD_REQUIRE: 'new_password_require',
  JWT_EXPIRED: 'TokenExpiredError',
  JWT_INVALID: 'JsonWebTokenError',
  USER_NOT_FOUND: 'UserNotFoundException'
  NOT_ENOUGH_PLACE_REMAINING: 'not_enough_place_remaining',
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
  [ERROR_ENUM.UNCONFIRMED_EMAIL]: {
    message: ERROR_ENUM.UNCONFIRMED_EMAIL,
    code: 402,
  },
  [ERROR_ENUM.INVALID_EMAIL]: {
    message: ERROR_ENUM.INVALID_EMAIL,
    code: 403,
  },
  [ERROR_ENUM.FORBIDDEN]: {
    message: ERROR_ENUM.FORBIDDEN,
    code: 403,
  },
  [ERROR_ENUM.TOKEN_IS_INVALID]: {
    message: ERROR_ENUM.TOKEN_IS_INVALID,
    code: 403,
  },
  [ERROR_ENUM.INVALID_TRANSIT_NUMBER]: {
    message: ERROR_ENUM.INVALID_TRANSIT_NUMBER,
    code: 403,
  },
  [ERROR_ENUM.UNREGISTRATION_ERROR]: {
    message: ERROR_ENUM.UNREGISTRATION_ERROR,
    code: 403,
  },
  [ERROR_ENUM.REMOVE_PAID_PLAYER]: {
    message: ERROR_ENUM.REMOVE_PAID_PLAYER,
    code: 403,
  },
  [ERROR_ENUM.ERROR_OCCURED]: {
    message: ERROR_ENUM.ERROR_OCCURED,
    code: 404,
  },
  [ERROR_ENUM.CLOSE_AFTER_OPEN]: {
    message: ERROR_ENUM.CLOSE_AFTER_OPEN,
    code: 405,
  },
  [ERROR_ENUM.REMOVE_LAST_CAPTAIN]: {
    message: ERROR_ENUM.REMOVE_LAST_CAPTAIN,
    code: 405,
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
  [ERROR_ENUM.VALUE_ALREADY_EXISTS]: {
    message: ERROR_ENUM.VALUE_ALREADY_EXISTS,
    code: 409,
  },
  [ERROR_ENUM.REGISTRATION_ERROR]: {
    message: ERROR_ENUM.REGISTRATION_ERROR,
    code: 411,
  },
  [ERROR_ENUM.NEW_PASSWORD_REQUIRE]: {
    message: ERROR_ENUM.NEW_PASSWORD_REQUIRE,
    code: 426,
  },
};
export { ERROR_ENUM, errors };
