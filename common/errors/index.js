const ERROR_ENUM = {
  ACCESS_DENIED: 'Access denied',
  ERROR_OCCURED: 'An error has occured',
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
  [ERROR_ENUM.ERROR_OCCURED]: {
    message: ERROR_ENUM.ERROR_OCCURED,
    code: 404,
  },
};
module.exports = { ERROR_ENUM, errors };
