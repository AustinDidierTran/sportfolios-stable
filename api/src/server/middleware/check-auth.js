const knex = require('../../db/connection');

module.exports = async (ctx, next) => {
  const token = ctx.headers['authorization'];

  if (!token) {
    console.log('token IS null')
    return next();
  }

  console.log('token should not be null')
  console.log('token == null', token == null);

  console.log('token', token);

  const req = await knex('user_token')
    .select(['user_id', 'expires_at'])
    .where({ token_id: token });

  if (!req.length) {
    return next();
  }

  const user = req[0];

  const { user_id, expires_at } = user;

  if (!user_id) {
    return next();
  }

  if (expires_at < new Date()) {
    return next();
  }

  const userInfo = {
    id: user_id,
  }

  const userRole = await knex('user_app_role')
    .select('app_role')
    .where({ user_id })

  if (userRole.length) {
    userInfo.appRole = userRole[0].app_role
  }

  if (ctx.body) {
    ctx.body.userInfo = userInfo;
  } else {
    ctx.body = { userInfo }
  }

  await next();
}