import { STATUS_ENUM } from '../../../../common/enums/index.js';
import { ERROR_ENUM, errors } from '../../../../common/errors/index.js';

export default async (ctx, next) => {
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
