import knex from '../../db/connection.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';

export default async (ctx, next) => {
  console.log(1);
  const token = ctx.headers['authorization'];
  console.log(2);

  if (!token || token === 'null') {
    return next();
  }
  console.log(3);

  const [user] = await knex('user_token')
    .select(['user_id', 'expires_at'])
    .where({ token_id: token });
  console.log(4);

  if (!user) {
    return next();
  }
  console.log(5);

  const { user_id, expires_at } = user;

  if (!user_id) {
    return next();
  }

  console.log(7);
  if (expires_at < new Date()) {
    if (!ctx.body) {
      ctx.body = {};
    }
    ctx.body.userInfo = { error: ERROR_ENUM.TOKEN_EXPIRED };
    return next();
  }
  console.log(8);

  const userInfo = {
    id: user_id,
  };
  console.log(9);

  const [{ app_role } = {}] = await knex('user_app_role')
    .select('app_role')
    .where({ user_id });
  console.log(10);

  if (app_role) {
    userInfo.appRole = app_role;
  }
  console.log(11);

  if (ctx.body) {
    console.log(12);
    ctx.body.userInfo = userInfo;
  } else {
    console.log(13);
    ctx.body = { userInfo };
  }
  console.log(14);

  return next();
};
