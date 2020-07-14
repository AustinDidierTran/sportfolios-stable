const { ERROR_ENUM } = require('../../../../common/errors');
const { ENTITIES_ROLE_ENUM } = require('../../../../common/enums');

module.exports = async (ctx, next) => {
  const { userInfo } = ctx.body;

  ENTITIES_ROLE_ENUM;
  if (userInfo.appRole !== ENTITIES_ROLE_ENUM.ADMIN) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  await next();
};
