import Router from 'koa-router';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import * as service from '../../service/event.js';
import { getUserId } from '../../helper/userHelper.js';
const router = new Router();
const BASE_URL = '/api/event';

router.get(`${BASE_URL}/rankings`, async ctx => {

  const rankings = await service.getRankings(
    ctx.query.eventId,
    ctx.body.userInfo.id,
  );

  if (!rankings) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.body = { data: rankings };
});

router.get(BASE_URL, async ctx => {
  const userId = getUserId(ctx);
  const event = await service.getEventGameType(
    ctx.query.eventId,
    userId,
  );

  if (!event) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: event };
});
export default router;
