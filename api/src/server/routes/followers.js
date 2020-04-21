const Router = require('koa-router');
const queries = require('../../db/queries/followers');

const router = new Router();
const BASE_URL = '/api/followers';

router.post(`${BASE_URL}/follow`, async ctx => {
  try {
    await queries.followAthlete(
      ctx.body.userInfo.id,
      ctx.request.body.targetId,
    );
    ctx.body = {
      status: 'success',
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.post(`${BASE_URL}/unfollow`, async ctx => {
  try {
    await queries.unfollowAthlete(
      ctx.body.userInfo.id,
      ctx.request.body.targetId,
    );
    ctx.body = {
      status: 'success',
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
