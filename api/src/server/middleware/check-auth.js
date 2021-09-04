import { ERROR_ENUM } from '../../../../common/errors/index.js';

export default async (ctx, next) => {
  if (
    ctx.body &&
    ctx.body.userInfo &&
    ctx.body.userInfo.error === ERROR_ENUM.TOKEN_EXPIRED
  ) {
    throw new Error(ERROR_ENUM.TOKEN_EXPIRED);
  }
  if (!ctx.body || !ctx.body.userInfo || !ctx.body.userInfo.id) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  return next();
};
