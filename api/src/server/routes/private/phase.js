import Router from 'koa-router';
import * as service from '../../service/phase.js';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';

const router = new Router();
const BASE_URL = '/api/entity';

router.get(`${BASE_URL}/prerankPhase`, async ctx => {
  const phase = await service.getPrerankPhase(
    ctx.query.eventId,
    ctx.body.userInfo.id,
  );
  if (!phase) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: phase };
});

router.put(`${BASE_URL}/updatePhase`, async ctx => {
  const entity = await service.updatePhase(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/updatePhaseOrder`, async ctx => {
  const entity = await service.updatePhaseOrder(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.post(`${BASE_URL}/phase`, async ctx => {
  const phase = await service.addPhase(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!phase) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: phase };
});

router.del(`${BASE_URL}/phase`, async ctx => {
  const phase = await service.deletePhase(
    ctx.query,
    ctx.body.userInfo.id,
  );
  if (!phase) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: phase };
});

export default router;
