import Router from 'koa-router';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import * as service from '../../service/shop.js';

const router = new Router();
const BASE_URL = '/api/shop';

router.get(`${BASE_URL}/getItem`, async ctx => {
  const data = await service.getItem(ctx.query.id);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

export default router;
