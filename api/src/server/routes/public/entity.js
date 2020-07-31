const Router = require('koa-router');
const queries = require('../../../db/queries/entity');

const router = new Router();
const BASE_URL = '/api/entity';

router.get(BASE_URL, async ctx => {
  const userId =
    ctx.body && ctx.body.userInfo && ctx.body.userInfo.id;
  const entity = await queries.getEntity(ctx.query.id, userId);

  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/eventInfos`, async ctx => {
  const userId =
    ctx.body && ctx.body.userInfo && ctx.body.userInfo.id;
  const entity = await queries.eventInfos(ctx.query.id, userId);

  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/allTeamsRegistered`, async ctx => {
  const entity = await queries.getAllRegistered(
    ctx.query.eventId,
    ctx.body.userInfo.id,
  );

  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/remainingSpots`, async ctx => {
  const entity = await queries.getRemainingSpots(ctx.query.id);

  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/getRoster`, async ctx => {
  const entity = await queries.getRoster(
    ctx.query.rosterId,
    ctx.body.userInfo.id,
  );

  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/options`, async ctx => {
  const option = await queries.getOptions(ctx.query.eventId);
  ctx.body = {
    status: 'success',
    data: option,
  };
});

module.exports = router;
