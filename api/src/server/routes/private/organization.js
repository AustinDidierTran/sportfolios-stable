import Router from 'koa-router';
import * as service from '../../service/organization.js';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
const router = new Router();
const BASE_URL = '/api/organization';

router.get(`${BASE_URL}/members`, async ctx => {
  const members = await service.getMembers(
    ctx.query,
    ctx.body.userInfo.id,
  );

  if (!members) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.body = { data: members };
});

export default router;
