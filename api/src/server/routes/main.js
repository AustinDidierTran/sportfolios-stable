const Router = require('koa-router');
const queries = require('../../db/queries/main');

const router = new Router();
const BASE_URL = '/api/data/main/';

router.get(`${BASE_URL}/followingUser`, async ctx => {
  try {
    const followingUser = await queries.getFollowingUsers(
      ctx.body.userInfo.id,
    );
    ctx.body = {
      status: 'success',
      data: followingUser,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

module.exports = router;
