import Router from 'koa-router';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import * as service from '../../service/search.js';

const router = new Router();
const BASE_URL = '/api/search';

router.get(`${BASE_URL}/global`, async ctx => {
  const entities = await service.globalSearch(
    ctx.body.userInfo.id,
    ctx.query.query,
    ctx.query.type,
    ctx.query.blackList,
    ctx.query.whiteList,
  );
  if (!entities) {
    throw new Error(STATUS_ENUM.ERROR_STRING);
  }
  ctx.body = {
    data: entities,
  };
});

router.get(`${BASE_URL}/myTeamsSearch`, async ctx => {
  const teams = await service.myTeamsSearch(
    ctx.body.userInfo.id,
    ctx.query.query,
    ctx.query.eventId,
  );
  if (!teams) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = {
    data: teams,
  };
});

router.get(`${BASE_URL}/previous`, async ctx => {
  const previousSearchQueries = await service.getPreviousSearchQueries(
    ctx.body.userInfo.id,
  );
  if (!previousSearchQueries) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = {
    data: previousSearchQueries,
  };
});

export default router;
