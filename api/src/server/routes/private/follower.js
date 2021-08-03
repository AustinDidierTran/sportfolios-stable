const Router = require('koa-router');
const service = require('../../service/follower');

const router = new Router();
const BASE_URL = '/api/followers';

router.post(`${BASE_URL}/follow`, async ctx => {
  await service.followAthlete(
    ctx.body.userInfo.id,
    ctx.request.body.targetId,
  );
});

router.post(`${BASE_URL}/unfollow`, async ctx => {
  await service.unfollowAthlete(
    ctx.body.userInfo.id,
    ctx.request.body.targetId,
  );
});

module.exports = router;
