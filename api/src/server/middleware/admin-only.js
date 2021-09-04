import { ERROR_ENUM } from '../../../../common/errors/index.js';
import { ENTITIES_ROLE_ENUM } from '../../../../common/enums/index.js';

export default async (ctx, next) => {
  const { userInfo } = ctx.body;

  ENTITIES_ROLE_ENUM;
  if (userInfo.appRole !== ENTITIES_ROLE_ENUM.ADMIN) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  await next();
};
