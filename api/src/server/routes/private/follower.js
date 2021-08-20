import Router from 'koa-router';
import * as service from '../../service/follower.js';

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

export default router;
