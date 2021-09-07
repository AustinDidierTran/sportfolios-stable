import knex from '../../db/connection.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';

export default async (ctx, next) => {
  const token = ctx.headers['authorization'];

  if (!token || token === 'null') {
    return next();
  }

  const [user] = await knex('user_token')
    .select(['user_id', 'expires_at'])
    .where({ token_id: token });

  if (!user) {
    return next();
  }

  const { user_id, expires_at } = user;

  if (!user_id) {
    return next();
  }

  if (expires_at < new Date()) {
    if (!ctx.body) {
      ctx.body = {};
    }
    ctx.body.userInfo = { error: ERROR_ENUM.TOKEN_EXPIRED };
    return next();
  }

  const userInfo = {
    id: user_id,
  };

  const [{ app_role } = {}] = await knex('user_app_role')
    .select('app_role')
    .where({ user_id });

  if (app_role) {
    userInfo.appRole = app_role;
  }

  if (ctx.body) {
    ctx.body.userInfo = userInfo;
  } else {
    ctx.body = { userInfo };
  }

  return next();
};
