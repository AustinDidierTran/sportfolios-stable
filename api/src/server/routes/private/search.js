const Router = require('koa-router');
const { ERROR_ENUM } = require('../../../../../common/errors');
const queries = require('../../../db/queries/search');

const router = new Router();
const BASE_URL = '/api/search';

router.get(`${BASE_URL}/global`, async ctx => {
  const entities = await queries.globalSearch(
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
  const teams = await queries.myTeamsSearch(
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
  const previousSearchQueries = await queries.getPreviousSearchQueries(
    ctx.body.userInfo.id,
  );
  if (!previousSearchQueries) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = {
    data: previousSearchQueries,
  };
});

module.exports = router;
