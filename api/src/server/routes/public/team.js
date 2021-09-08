const BASE_URL = '/api/team';
import Router from 'koa-router';
const router = new Router();
import * as service from '../../service/team.js';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import { getUserId } from '../../helper/userHelper.js'
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
  const teams = await service.getTeamsRegisteredInfos(
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
  const teams = await service.getTeamsAcceptedInfos(
    ctx.query.eventId,
    userId,
  );

  if (!teams) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: teams };
});
export default router;
