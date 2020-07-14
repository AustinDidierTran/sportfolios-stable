const { errors, ERROR_ENUM } = require('../../../../common/errors');

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch ({ message }) {
    const error = errors[message] || errors[ERROR_ENUM.ERROR_OCCURED];

    if (process.env.NODE_ENV !== 'development') {
      ctx.status = error.code;
      ctx.body = {
        status: 'error',
        message: errors[ERROR_ENUM.ERROR_OCCURED].message,
      };
    } else {
      ctx.status = error.code;
      ctx.body = {
        status: 'error',
        message: error.message,
      };
    }
  }
};
