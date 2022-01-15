import Router from 'koa-router';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import * as service from '../../service/event';
import { getUserId } from '../../helper/userHelper.js';
const router = new Router();
const BASE_URL = '/api/event';

/**
 * Currently only returns spirits ranking, should eventually return
 * preranking and phase rankings as well
 */
router.get(`${BASE_URL}/rankings`, async ctx => {
  const rankings = await service.getRankings(ctx.query.eventId);

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
