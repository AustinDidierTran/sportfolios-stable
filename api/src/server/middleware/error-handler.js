const { STATUS_ENUM } = require('../../../../common/enums');
const { ERROR_ENUM, errors } = require('../../../../common/errors');

module.exports = async (ctx, next) => {
  try {
    ctx.status = STATUS_ENUM.SUCCESS;
    await next();
  } catch ({ message }) {
    const error = errors[message] || errors[ERROR_ENUM.ERROR_OCCURED];

    if (process.env.DISPLAY_ERROR) {
      ctx.status = error.code;
      ctx.body = {
        status: 'error',
        message: error.message,
      };
    } else {
      ctx.status = error.code;
      ctx.body = {
        status: 'error',
        message: errors[ERROR_ENUM.ERROR_OCCURED].message,
      };
    }
  }
};
