import Router from 'koa-router';
import * as service from '../../service/interactiveTool.js';
const router = new Router();
const BASE_URL = '/api/entity';

router.post(`${BASE_URL}/addAllInteractiveTool`, async ctx => {
  const res = await service.addAll(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

export default router;
