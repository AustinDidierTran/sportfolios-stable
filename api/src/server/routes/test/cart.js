import Router from 'koa-router';
import { STATUS_ENUM } from '../../../../../common/enums/index.js';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import * as service from '../../service/entity.js';

const router = new Router();
const BASE_URL = '/api/test/cart';

router.get(`${BASE_URL}/removeEventCartItem`, async ctx => {
  const res = await service.removeEventCartItem({
    rosterId: ctx.body.rosterId,
  });

  if (res.code === STATUS_ENUM.SUCCESS) {
    ctx.body = { status: 'success' };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

export default router;
