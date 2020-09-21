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

router.get(`${BASE_URL}/allTeamsRegisteredInfos`, async ctx => {
  const userId =
    ctx.body && ctx.body.userInfo && ctx.body.userInfo.id;
  const entity = await queries.getAllRegisteredInfos(
    ctx.query.eventId,
    userId,
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
  const remaining = await queries.getRemainingSpots(ctx.query.id);

  if (remaining) {
    ctx.body = {
      status: 'success',
      data: remaining,
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
  const entity = await queries.getRoster(ctx.query.rosterId);

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

router.get(`${BASE_URL}/phases`, async ctx => {
  const phases = await queries.getPhases(ctx.query.eventId);

  if (phases) {
    ctx.body = {
      status: 'success',
      data: phases,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/games`, async ctx => {
  const games = await queries.getGames(ctx.query.eventId);

  if (games) {
    ctx.body = {
      status: 'success',
      data: games,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/slots`, async ctx => {
  const slots = await queries.getSlots(ctx.query.eventId);

  if (slots) {
    ctx.body = {
      status: 'success',
      data: slots,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/teamsSchedule`, async ctx => {
  const teams = await queries.getTeamsSchedule(ctx.query.eventId);

  if (teams) {
    ctx.body = {
      status: 'success',
      data: teams,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/fields`, async ctx => {
  const field = await queries.getFields(ctx.query.eventId);

  if (field) {
    ctx.body = {
      status: 'success',
      data: field,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

module.exports = router;
