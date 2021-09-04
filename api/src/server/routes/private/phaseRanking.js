import Router from 'koa-router';
import * as service from '../../service/phaseRanking.js';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';

const router = new Router();
const BASE_URL = '/api/entity';

router.get(`${BASE_URL}/phaseRanking`, async ctx => {
  const phaseRankings = await service.getPhaseRanking(
    ctx.query.phaseId,
  );

  if (!phaseRankings) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: phaseRankings };
});

router.put(`${BASE_URL}/updateTeamPhase`, async ctx => {
  const entity = await service.updateTeamPhase(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/teamPhase`, async ctx => {
  const res = await service.deleteTeamPhase(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.put(`${BASE_URL}/updateInitialPositionPhase`, async ctx => {
  const entity = await service.updateInitialPositionPhase(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/finalPositionPhase`, async ctx => {
  const entity = await service.updateFinalPositionPhase(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/originPhase`, async ctx => {
  const entity = await service.updateOriginPhase(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

export default router;
