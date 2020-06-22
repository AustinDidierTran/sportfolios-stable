const Router = require('koa-router');
const queries = require('../../../db/queries/followers');

const router = new Router();
const BASE_URL = '/api/followers';

router.post(`${BASE_URL}/follow`, async ctx => {
  await queries.followAthlete(
    ctx.body.userInfo.id,
    ctx.request.body.targetId,
  );
  ctx.body = {
    status: 'success',
  };
});

router.post(`${BASE_URL}/unfollow`, async ctx => {
  await queries.unfollowAthlete(
    ctx.body.userInfo.id,
    ctx.request.body.targetId,
  );
  ctx.body = {
    status: 'success',
  };
});

module.exports = router;
