import Router from 'koa-router';
import * as service from '../../service/event.js';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';

const router = new Router();
const BASE_URL = '/api/event';

const getUserId = ctx => {
  let userId = -1;
  if (ctx.body && ctx.body.userInfo && ctx.body.userInfo.id) {
    userId = ctx.body.userInfo.id;
  }
  return userId;
};

router.get(`${BASE_URL}/getAllPeopleRegisteredNotInTeamsInfos`, async ctx => {
  const userId = getUserId(ctx);
  const people = await service.getAllPeopleRegisteredNotInTeamsInfos(
    ctx.query.eventId,
    userId,
  );

  if (!people) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: people };
});

export default router;