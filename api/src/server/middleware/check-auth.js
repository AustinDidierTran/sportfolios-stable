const knex = require('../../db/connection');

module.exports = async (ctx, next) => {
  const token = ctx.headers['authorization'];

  if (!token) {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Access denied',
    };
  }

  const req = await knex('user_token')
    .select(['user_id', 'expires_at'])
    .where({ token_id: token });

  if (!req.length) {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Access denied',
    };
  }

  const user = req[0];

  const { user_id, expires_at } = user;

  if (!user_id) {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Access denied',
    };
  } else if (expires_at < new Date()) {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Access denied',
    };
  } else {
    const userInfo = {
      id: user_id,
    };

    const userRole = await knex('user_app_role')
      .select('app_role')
      .where({ user_id });

    if (userRole.length) {
      userInfo.appRole = userRole[0].app_role;
    }

    if (ctx.body) {
      ctx.body.userInfo = userInfo;
    } else {
      ctx.body = { userInfo };
    }
    return next();
  }
};
