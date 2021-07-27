const Router = require('koa-router');
const queries = require('../../../db/queries/entity');
const {
  OrganizationController,
} = require('../../../../../controllers/organization');
const {
  EventController,
} = require('../../../../../controllers/event');
const {
  GLOBAL_ENUM,
  STATUS_ENUM,
} = require('../../../../../common/enums');
const router = new Router();
const BASE_URL = '/api/entity';

const getUserId = ctx => {
  let userId = -1;
  if (ctx.body && ctx.body.userInfo && ctx.body.userInfo.id) {
    userId = ctx.body.userInfo.id;
  }
  return userId;
};

router.get(BASE_URL, async ctx => {
  const type = await queries.getEntitiesTypeById(ctx.query.id);
  const userId = getUserId(ctx);
  let entity;

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
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
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
  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: entity,
  };
});

router.get(`${BASE_URL}/alias`, async ctx => {
  const alias = await queries.getAlias(ctx.query.entityId);

  if (!alias) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: alias,
  };
});

router.get(`${BASE_URL}/eventInfos`, async ctx => {
  const userId = getUserId(ctx);
  const event = await queries.eventInfos(ctx.query.id, userId);

  if (!event) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: event,
  };
});

router.get(`${BASE_URL}/events`, async ctx => {
  const userId = getUserId(ctx);

  const entity = await OrganizationController.events(
    ctx.query.id,
    userId,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: entity,
  };
});

router.get(`${BASE_URL}/membershipsTab`, async ctx => {
  const userId = getUserId(ctx);

  const entity = await OrganizationController.memberships(
    ctx.query.id,
    userId,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: entity,
  };
});

router.get(`${BASE_URL}/home`, async ctx => {
  const type = await queries.getEntitiesTypeById(ctx.query.id);
  let entity;

  const userId = getUserId(ctx);

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

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: entity,
  };
});

router.get(`${BASE_URL}/about`, async ctx => {
  const type = await queries.getEntitiesTypeById(ctx.query.id);
  let entity;

  const userId = getUserId(ctx);

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
  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: entity,
  };
});

router.get(`${BASE_URL}/teams`, async ctx => {
  const userId = getUserId(ctx);

  const teams = await EventController.teams(ctx.query.id, userId);

  if (!teams) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: teams,
  };
});

router.get(`${BASE_URL}/schedule`, async ctx => {
  const userId = getUserId(ctx);

  const schedule = await EventController.schedule(
    ctx.query.id,
    userId,
  );

  if (!schedule) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: schedule,
  };
});

router.get(`${BASE_URL}/rankings`, async ctx => {
  const userId = getUserId(ctx);

  const rankings = await EventController.rankings(
    ctx.query.id,
    userId,
  );

  if (!rankings) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: rankings,
  };
});

router.get(`${BASE_URL}/teamExercises`, async ctx => {
  const exercise = await queries.getTeamExercises(ctx.query.teamId);

  if (!exercise) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: exercise,
  };
});

router.get(`${BASE_URL}/sessionExercises`, async ctx => {
  const exercise = await queries.getSessionExercises(
    ctx.query.sessionId,
  );

  if (!exercise) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: exercise,
  };
});

router.get(`${BASE_URL}/allTeamsRegisteredInfos`, async ctx => {
  const userId = getUserId(ctx);

  const teams = await queries.getAllTeamsRegisteredInfos(
    ctx.query.eventId,
    ctx.query.pills,
    userId,
  );

  if (!teams) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: teams,
  };
});
router.get(`${BASE_URL}/allTeamsAcceptedInfos`, async ctx => {
  const userId = getUserId(ctx);

  const teams = await queries.getAllTeamsAcceptedInfos(
    ctx.query.eventId,
    userId,
  );

  if (!teams) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: teams,
  };
});

router.get(`${BASE_URL}/allPeopleRegisteredInfos`, async ctx => {
  const userId = getUserId(ctx);

  const people = await queries.getAllPeopleRegisteredInfos(
    ctx.query.eventId,
    userId,
  );

  if (!people) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: people,
  };
});

router.get(`${BASE_URL}/players`, async ctx => {
  const players = await queries.getTeamPlayers(ctx.query.teamId);

  if (!players) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: players,
  };
});

router.get(`${BASE_URL}/rosterPlayers`, async ctx => {
  const players = await queries.getRosterPlayers(ctx.query.rosterId);

  if (!players) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: players,
  };
});

router.get(`${BASE_URL}/myTeamPlayers`, async ctx => {
  const userId = getUserId(ctx);

  const myTeamPlayers = await queries.getMyTeamPlayers(
    ctx.query.teamId,
    userId,
  );

  if (!myTeamPlayers) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: myTeamPlayers,
  };
});

router.get(`${BASE_URL}/preranking`, async ctx => {
  const ranking = await queries.getPreranking(ctx.query.eventId);

  if (!ranking) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: ranking,
  };
});

router.get(`${BASE_URL}/remainingSpots`, async ctx => {
  const remaining = await queries.getRemainingSpots(ctx.query.id);

  if (remaining < 0) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: remaining,
  };
});

router.get(`${BASE_URL}/getRoster`, async ctx => {
  const roster = await queries.getRoster(
    ctx.query.rosterId,
    ctx.query.withSub,
  );

  if (!roster) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: roster,
  };
});

router.get(`${BASE_URL}/options`, async ctx => {
  const option = await queries.getOptions(ctx.query.eventId);

  if (!option) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: option,
  };
});

router.get(`${BASE_URL}/phases`, async ctx => {
  const phases = await queries.getPhases(ctx.query.eventId);

  if (!phases) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: phases,
  };
});

router.get(`${BASE_URL}/games`, async ctx => {
  const games = await queries.getGames(ctx.query.eventId);

  if (!games) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: games,
  };
});

router.get(`${BASE_URL}/gameInfo`, async ctx => {
  const userId = getUserId(ctx);

  const gameInfo = await queries.getGameInfo(
    ctx.query.gameId,
    userId,
  );

  if (!gameInfo) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: gameInfo,
  };
});

router.get(`${BASE_URL}/teamLocations`, async ctx => {
  const locations = await queries.getSessionLocations(
    ctx.query.teamId,
  );

  if (!locations) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: locations,
  };
});

router.get(`${BASE_URL}/practiceBasicInfo`, async ctx => {
  const userId = getUserId(ctx);

  const practicesBasicInfo = await queries.getPracticeBasicInfo(
    ctx.query.teamId,
    userId,
  );

  if (!practicesBasicInfo) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: practicesBasicInfo,
  };
});

router.get(`${BASE_URL}/practiceInfo`, async ctx => {
  const userId = getUserId(ctx);

  const practiceInfo = await queries.getPracticeInfo(
    ctx.query.practiceId,
    userId,
  );

  if (!practiceInfo) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: practiceInfo,
  };
});

router.get(`${BASE_URL}/teamGames`, async ctx => {
  const games = await queries.getTeamGames(ctx.query.eventId);

  if (!games) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: games,
  };
});

router.get(`${BASE_URL}/phasesGameAndTeams`, async ctx => {
  const games = await queries.getPhasesGameAndTeams(
    ctx.query.eventId,
    ctx.query.phaseId,
  );

  if (!games) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = { const res = await knex('game_rsvp')
    status: 'success',
    data: games,
  };
});

router.get(`${BASE_URL}/gameOptions`, async ctx => {
  const gameOptions = await queries.getGameOptions(ctx.query.eventId);

  if (!gameOptions) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: gameOptions,
  };
});

router.get(`${BASE_URL}/fields`, async ctx => {
  const field = await queries.getFields(ctx.query.eventId);

  if (!field) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: field,
  };
});

router.get(`${BASE_URL}/rosters`, async ctx => {
  const rosters = await queries.getTeamRosters(ctx.query.teamId);
  if (!rosters) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: rosters,
  };
});

router.get(`${BASE_URL}/rostersNames`, async ctx => {
  const names = await queries.getRostersNames(ctx.query.id);
  if (!names) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: names,
  };
});

router.get(`${BASE_URL}/hasSpirit`, async ctx => {
  const getHasSpirit = await queries.getHasSpirit(ctx.query.eventId);

  if (!getHasSpirit) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: getHasSpirit,
  };
});

module.exports = router;
