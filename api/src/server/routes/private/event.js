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

router.get(
  `${BASE_URL}/getAllPeopleRegisteredNotInTeamsInfos`,
  async ctx => {
    const userId = getUserId(ctx);
    const people = await service.getAllPeopleRegisteredNotInTeamsInfos(
      ctx.query.eventId,
      userId,
    );

    if (!people) {
      throw new Error(ERROR_ENUM.ERROR_OCCURED);
    }
    ctx.body = { data: people };
  },
);

router.get(`${BASE_URL}/verifyTeamNameIsUnique`, async ctx => {
  const teamNameIsUnique = await service.verifyTeamNameIsUnique(
    ctx.query,
  );

  ctx.body = { data: teamNameIsUnique };
});

router.get(`${BASE_URL}/forYouPage`, async ctx => {
  const entity = await service.getForYouPagePosts(ctx.query);

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.post(BASE_URL, async ctx => {
  const entityId = await service.addEvent(
    ctx.request.body.name,
    ctx.request.body.startDate,
    ctx.request.body.endDate,
    ctx.request.body.photoUrl,
    ctx.request.body.type,
    ctx.request.body.maximumSpots,
    ctx.request.body.creatorId,
    ctx.request.body.ticketLimit,
  );

  if (!entityId) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entityId };
});

export default router;
