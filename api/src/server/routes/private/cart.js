import Router from 'koa-router';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import * as service from '../../service/cart.ts';

const router = new Router();
const BASE_URL = '/api/cart';

router.get(`${BASE_URL}/getCartItems`, async ctx => {

  const data = await service.getCartItems(ctx.body.userInfo.id);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

export default router;
