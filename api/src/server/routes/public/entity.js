const Router = require('koa-router');
const queries = require('../../../db/queries/entity');
const {
  OrganizationController,
} = require('../../../../../controllers/organization');
const {
  EventController,
} = require('../../../../../controllers/event');
const { GLOBAL_ENUM } = require('../../../../../common/enums');
const router = new Router();
const BASE_URL = '/api/entity';

router.get(BASE_URL, async ctx => {
  const type = await queries.getEntitiesTypeById(ctx.query.id);
  let entity;

  let userId = -1;
  if (ctx.body && ctx.body.userInfo && ctx.body.userInfo.id) {
    userId = ctx.body.userInfo.id;
  }

  switch (type) {
    case GLOBAL_ENUM.ORGANIZATION:
      entity = await OrganizationController.organization(
        ctx.query.id,
        userId,
      );
      break;
    case GLOBAL_ENUM.EVENT:
      entity = await EventController.event(ctx.query.id, userId);
      break;
    default:
      entity = await queries.getEntity(ctx.query.id, userId);
  }

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

router.get(`${BASE_URL}/realId`, async ctx => {
  const entity = await queries.getRealId(ctx.query.id);

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.body = {
    status: 'success',
    data: entity,
  };
});

router.get(`${BASE_URL}/alias`, async ctx => {
  const alias = await queries.getAlias(ctx.query.entityId);

  if (alias) {
    ctx.body = {
      status: 'success',
      data: alias,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});
router.get(`${BASE_URL}/role`, async ctx => {
  const role = await queries.getRole(
    ctx.query.entityId,
    ctx.body.userInfo.id,
  );

  if (role) {
    ctx.body = {
      status: 'success',
      data: role,
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

router.get(`${BASE_URL}/events`, async ctx => {
  let userId = -1;
  if (ctx.body && ctx.body.userInfo && ctx.body.userInfo.id) {
    userId = ctx.body.userInfo.id;
  }

  const entity = await OrganizationController.events(
    ctx.query.id,
    userId,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.body = {
    status: 'success',
    data: entity,
  };
});

router.get(`${BASE_URL}/membershipsTab`, async ctx => {
  let userId = -1;
  if (ctx.body && ctx.body.userInfo && ctx.body.userInfo.id) {
    userId = ctx.body.userInfo.id;
  }
  const entity = await OrganizationController.memberships(
    ctx.query.id,
    userId,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.body = {
    status: 'success',
    data: entity,
  };
});

router.get(`${BASE_URL}/home`, async ctx => {
  const type = await queries.getEntitiesTypeById(ctx.query.id);
  let entity;

  let userId = -1;
  if (ctx.body && ctx.body.userInfo && ctx.body.userInfo.id) {
    userId = ctx.body.userInfo.id;
  }
  switch (type) {
    case GLOBAL_ENUM.ORGANIZATION:
      entity = await OrganizationController.home(
        ctx.query.id,
        userId,
      );
      break;
    case GLOBAL_ENUM.EVENT:
      entity = await EventController.home(ctx.query.id, userId);
      break;
    default:
      entity = await queries.getEntity(ctx.query.id, userId);
  }

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.body = {
    status: 'success',
    data: entity,
  };
});

router.get(`${BASE_URL}/about`, async ctx => {
  const type = await queries.getEntitiesTypeById(ctx.query.id);
  let entity;

  let userId = -1;
  if (ctx.body && ctx.body.userInfo && ctx.body.userInfo.id) {
    userId = ctx.body.userInfo.id;
  }

  switch (type) {
    case GLOBAL_ENUM.ORGANIZATION:
      entity = await OrganizationController.about(
        ctx.query.id,
        userId,
      );
      break;
    case GLOBAL_ENUM.EVENT:
      entity = await EventController.about(ctx.query.id, userId);
      break;
    default:
      entity = await queries.getEntity(ctx.query.id, userId);
  }

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = {
    status: 'success',
    data: entity,
  };
});

router.get(`${BASE_URL}/teams`, async ctx => {
  let userId = -1;
  if (ctx.body && ctx.body.userInfo && ctx.body.userInfo.id) {
    userId = ctx.body.userInfo.id;
  }
  const entity = await EventController.teams(ctx.query.id, userId);

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.body = {
    status: 'success',
    data: entity,
  };
});

router.get(`${BASE_URL}/schedule`, async ctx => {
  let userId = -1;
  if (ctx.body && ctx.body.userInfo && ctx.body.userInfo.id) {
    userId = ctx.body.userInfo.id;
  }

  const entity = await EventController.schedule(ctx.query.id, userId);

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.body = {
    status: 'success',
    data: entity,
  };
});

router.get(`${BASE_URL}/rankings`, async ctx => {
  let userId = -1;
  if (ctx.body && ctx.body.userInfo && ctx.body.userInfo.id) {
    userId = ctx.body.userInfo.id;
  }
  const entity = await EventController.rankings(ctx.query.id, userId);

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.body = {
    status: 'success',
    data: entity,
  };
});

router.get(`${BASE_URL}/allTeamsRegisteredInfos`, async ctx => {
  const userId =
    ctx.body && ctx.body.userInfo && ctx.body.userInfo.id;
  const entity = await queries.getAllTeamsRegisteredInfos(
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
router.get(`${BASE_URL}/allTeamsAcceptedInfos`, async ctx => {
  const userId =
    ctx.body && ctx.body.userInfo && ctx.body.userInfo.id;
  const entity = await queries.getAllTeamsAcceptedInfos(
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

router.get(`${BASE_URL}/allPeopleRegisteredInfos`, async ctx => {
  const userId =
    ctx.body && ctx.body.userInfo && ctx.body.userInfo.id;
  const entity = await queries.getAllPeopleRegisteredInfos(
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

router.get(`${BASE_URL}/preranking`, async ctx => {
  const ranking = await queries.getPreranking(ctx.query.eventId);
  if (ranking) {
    ctx.body = {
      status: 'success',
      data: ranking,
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

  if (remaining >= 0) {
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
  const entity = await queries.getRoster(
    ctx.query.rosterId,
    ctx.query.withSub,
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

router.get(`${BASE_URL}/gameInfo`, async ctx => {
  const gameInfo = await queries.getGameInfo(
    ctx.query.gameId,
    ctx.body.userInfo.id,
  );

  if (gameInfo) {
    ctx.body = {
      status: 'success',
      data: gameInfo,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/practiceInfo`, async ctx => {
  const practiceInfo = await queries.getPracticeInfo(
    ctx.query.practiceId,
  );

  if (practiceInfo) {
    ctx.body = {
      status: 'success',
      data: practiceInfo,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/teamGames`, async ctx => {
  const games = await queries.getTeamGames(ctx.query.eventId);

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
router.get(`${BASE_URL}/phasesGameAndTeams`, async ctx => {
  const games = await queries.getPhasesGameAndTeams(
    ctx.query.eventId,
    ctx.query.phaseId,
  );

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

router.get(`${BASE_URL}/rostersNames`, async ctx => {
  const res = await queries.getRostersNames(ctx.query.id);
  if (res) {
    ctx.body = {
      status: 'success',
      data: res,
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
