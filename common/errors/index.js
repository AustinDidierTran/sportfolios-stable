const ERROR_ENUM = {
  ACCESS_DENIED: 'Access denied',
  ERROR_OCCURED: 'An error has occured',
  INVALID_TRANSIT_NUMBER:
    'Invalid transit number. The number should be in the format xxxxx-yyy or xxxxxyyy.',
  TOKEN_EXPIRED: 'Token has expired',
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
};
module.exports = { ERROR_ENUM, errors };
