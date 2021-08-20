import Router from 'koa-router';
import * as service from '../../service/entity.js';
import * as organizationService from '../../service/organization.js';
import * as eventService from '../../service/event.js';
import { GLOBAL_ENUM } from '../../../../../common/enums/index.js';
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
  const type = await service.getEntitiesTypeById(ctx.query.id);
  const userId = getUserId(ctx);
  let entity;

  switch (type) {
    case GLOBAL_ENUM.ORGANIZATION:
      entity = await organizationService.getOrganization(
        ctx.query.id,
        userId,
      );
      break;
    case GLOBAL_ENUM.EVENT:
      entity = await eventService.getEvent(ctx.query.id, userId);
      break;
    default:
      entity = await service.getEntity(ctx.query.id, userId);
  }

  if (entity) {
    ctx.body = { data: entity };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.get(`${BASE_URL}/realId`, async ctx => {
  const entity = await service.getRealId(ctx.query.id);

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.get(`${BASE_URL}/alias`, async ctx => {
  const alias = await service.getAlias(ctx.query.entityId);

  if (!alias) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: alias };
});

router.get(`${BASE_URL}/eventInfos`, async ctx => {
  const userId = getUserId(ctx);
  const event = await service.eventInfos(ctx.query.id, userId);

  if (!event) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: event };
});

router.get(`${BASE_URL}/teamExercises`, async ctx => {
  const exercise = await service.getTeamExercises(ctx.query.teamId);

  if (!exercise) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: exercise };
});

router.get(`${BASE_URL}/sessionExercises`, async ctx => {
  const exercise = await service.getSessionExercises(
    ctx.query.sessionId,
  );

  if (!exercise) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: exercise };
});

router.get(`${BASE_URL}/allTeamsRegisteredInfos`, async ctx => {
  const userId = getUserId(ctx);
  const teams = await service.getAllTeamsRegisteredInfos(
    ctx.query.eventId,
    ctx.query.pills,
    userId,
  );

  if (!teams) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: teams };
});
router.get(`${BASE_URL}/allTeamsAcceptedInfos`, async ctx => {
  const userId = getUserId(ctx);
  const teams = await service.getAllTeamsAcceptedInfos(
    ctx.query.eventId,
    userId,
  );

  if (!teams) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: teams };
});

router.get(`${BASE_URL}/allPeopleRegisteredInfos`, async ctx => {
  const userId = getUserId(ctx);
  const people = await service.getAllPeopleRegisteredInfos(
    ctx.query.eventId,
    userId,
  );

  if (!people) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: people };
});

router.get(`${BASE_URL}/players`, async ctx => {
  const players = await service.getTeamPlayers(ctx.query.teamId);

  if (!players) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: players };
});

router.get(`${BASE_URL}/rosterPlayers`, async ctx => {
  const players = await service.getRosterPlayers(ctx.query.rosterId);

  if (!players) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: players };
});

router.get(`${BASE_URL}/myTeamPlayers`, async ctx => {
  const userId = getUserId(ctx);
  const myTeamPlayers = await service.getMyTeamPlayers(
    ctx.query.teamId,
    userId,
  );

  if (!myTeamPlayers) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: myTeamPlayers };
});

router.get(`${BASE_URL}/preranking`, async ctx => {
  const ranking = await service.getPreranking(ctx.query.eventId);

  if (!ranking) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: ranking };
});

router.get(`${BASE_URL}/remainingSpots`, async ctx => {
  const remaining = await service.getRemainingSpots(ctx.query.id);

  if (remaining < 0) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: remaining };
});

router.get(`${BASE_URL}/getRoster`, async ctx => {
  const roster = await service.getRoster(
    ctx.query.rosterId,
    ctx.query.withSub,
  );

  if (!roster) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: roster };
});

router.get(`${BASE_URL}/options`, async ctx => {
  const option = await service.getOptions(ctx.query.eventId);

  if (!option) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: option };
});

router.get(`${BASE_URL}/phases`, async ctx => {
  const phases = await service.getPhases(ctx.query.eventId);

  if (!phases) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: phases };
});

router.get(`${BASE_URL}/games`, async ctx => {
  const games = await service.getGames(ctx.query.eventId);

  if (!games) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: games };
});

router.get(`${BASE_URL}/gameInfo`, async ctx => {
  const userId = getUserId(ctx);
  const gameInfo = await service.getGameInfo(
    ctx.query.gameId,
    userId,
  );

  if (!gameInfo) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: gameInfo };
});

router.get(`${BASE_URL}/teamLocations`, async ctx => {
  const locations = await service.getSessionLocations(
    ctx.query.teamId,
  );

  if (!locations) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: locations };
});

router.get(`${BASE_URL}/practiceBasicInfo`, async ctx => {
  const userId = getUserId(ctx);
  const practicesBasicInfo = await service.getPracticeBasicInfo(
    ctx.query.teamId,
    userId,
  );

  if (!practicesBasicInfo) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: practicesBasicInfo };
});

router.get(`${BASE_URL}/practiceInfo`, async ctx => {
  const practiceInfo = await service.getPracticeInfo(
    ctx.query.practiceId,
  );

  if (!practiceInfo) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: practiceInfo };
});

router.get(`${BASE_URL}/teamGames`, async ctx => {
  const games = await service.getTeamGames(ctx.query.eventId);

  if (!games) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: games };
});

router.get(`${BASE_URL}/phasesGameAndTeams`, async ctx => {
  const games = await service.getPhasesGameAndTeams(
    ctx.query.eventId,
    ctx.query.phaseId,
  );

  if (!games) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: games };
});

router.get(`${BASE_URL}/gameOptions`, async ctx => {
  const gameOptions = await service.getGameOptions(ctx.query.eventId);

  if (!gameOptions) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: gameOptions };
});

router.get(`${BASE_URL}/fields`, async ctx => {
  const field = await service.getFields(ctx.query.eventId);

  if (!field) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: field };
});

router.get(`${BASE_URL}/rosters`, async ctx => {
  const rosters = await service.getTeamRosters(ctx.query.teamId);

  if (!rosters) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: rosters };
});

router.get(`${BASE_URL}/rostersNames`, async ctx => {
  const names = await service.getRostersNames(ctx.query.id);

  if (!names) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: names };
});

router.get(`${BASE_URL}/hasSpirit`, async ctx => {
  const getHasSpirit = await service.getHasSpirit(ctx.query.eventId);

  if (!getHasSpirit) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: getHasSpirit };
});

export default router;
